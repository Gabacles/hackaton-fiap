"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, hydrateAuthFromStorage } from '../../../store/auth';
import api from '../../../lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Activity {
  id: string;
  title: string;
  description: string | null;
  content: string;
  createdAt: string;
  assignments: Array<{
    id: string;
    status: 'PENDING' | 'COMPLETED' | 'SUBMITTED';
    student: {
      id: string;
      name: string;
    };
  }>;
}

interface Student {
  id: string;
  name: string;
  email: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, logout } = useAuthStore();
  const queryClient = useQueryClient();
  // Hydrate auth from storage on mount
  useEffect(() => {
    hydrateAuthFromStorage();
  }, []);
  // Redirect if not logged in or not a teacher
  useEffect(() => {
    if (!token) return;
    if (user && user.role !== 'DOCENTE') {
      router.push('/aluno');
    }
  }, [token, user, router]);

  const {
    data: activities,
    isLoading: loadingActivities,
    error: activitiesError,
  } = useQuery<Activity[]>(['teacherActivities'], async () => {
    const res = await api.get<Activity[]>('/activities/mine');
    return res.data;
  });

  const {
    data: students,
    isLoading: loadingStudents,
  } = useQuery<Student[]>(
    ['students'],
    async () => {
      const res = await api.get<Student[]>('/users/students');
      return res.data;
    },
    { enabled: !!user && user.role === 'DOCENTE' },
  );

  const createMutation = useMutation(
    async (data: { title: string; description?: string; content: string }) => {
      const res = await api.post('/activities', data);
      return res.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['teacherActivities']);
      },
    },
  );

  const assignMutation = useMutation(
    async ({ activityId, studentIds }: { activityId: string; studentIds: string[] }) => {
      const res = await api.post(`/activities/${activityId}/assign`, { studentIds });
      return res.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['teacherActivities']);
      },
    },
  );

  // Form state for creating activity
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newContent, setNewContent] = useState('');
  const [formError, setFormError] = useState('');

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle || !newContent) {
      setFormError('Título e conteúdo são obrigatórios');
      return;
    }
    setFormError('');
    await createMutation.mutateAsync({ title: newTitle, description: newDescription, content: newContent });
    setShowCreate(false);
    setNewTitle('');
    setNewDescription('');
    setNewContent('');
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="mb-6 flex items-center justify-between border-b-2 pb-3">
        <h1 className="text-2xl font-bold">Olá, {user?.name}</h1>
        <button
          onClick={() => {
            logout();
            router.push('/login');
          }}
          className="rounded bg-red-600 px-3 py-2 text-white hover:bg-red-700"
        >
          Sair
        </button>
      </header>
      <main className="space-y-6">
        <div>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            {showCreate ? 'Cancelar' : 'Criar nova atividade'}
          </button>
          {showCreate && (
            <form onSubmit={handleCreate} className="mt-4 space-y-3 rounded-md bg-white p-4 shadow">
              {formError && <p className="text-sm text-red-600">{formError}</p>}
              <div>
                <label className="block text-sm font-medium text-gray-700">Título</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descrição (opcional)</label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Conteúdo</label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
                  rows={4}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={createMutation.isLoading}
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {createMutation.isLoading ? 'Criando…' : 'Salvar atividade'}
              </button>
            </form>
          )}
        </div>
        <section>
          <h2 className="mb-2 text-xl font-semibold">Minhas atividades</h2>
          {loadingActivities ? (
            <p>Carregando…</p>
          ) : activitiesError ? (
            <p className="text-red-600">Erro ao carregar atividades</p>
          ) : activities && activities.length > 0 ? (
            <ul className="space-y-4">
              {activities.map((activity) => (
                <li key={activity.id} className="rounded-md bg-white p-4 shadow">
                  <h3 className="text-lg font-bold">{activity.title}</h3>
                  {activity.description && <p className="text-sm text-gray-600">{activity.description}</p>}
                  <p className="mt-2 whitespace-pre-line text-gray-700">{activity.content}</p>
                  <p className="mt-2 text-xs text-gray-500">
                    Criado em {new Date(activity.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                  <div className="mt-3">
                    <details>
                      <summary className="cursor-pointer text-blue-600 hover:underline">
                        Atribuir aos alunos
                      </summary>
                      <div className="mt-2 space-y-2">
                        {loadingStudents ? (
                          <p>Carregando lista de alunos…</p>
                        ) : students && students.length > 0 ? (
                          <AssignForm
                            activityId={activity.id}
                            students={students}
                            assign={assignMutation.mutateAsync}
                            disabled={assignMutation.isLoading}
                          />
                        ) : (
                          <p>Não há alunos disponíveis</p>
                        )}
                      </div>
                    </details>
                  </div>
                  {activity.assignments.length > 0 && (
                    <div className="mt-3">
                      <h4 className="font-medium">Atribuições</h4>
                      <ul className="mt-1 list-disc pl-5 text-sm text-gray-700">
                        {activity.assignments.map((assign) => (
                          <li key={assign.id}>
                            {assign.student.name} – {assign.status}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>Você ainda não criou atividades.</p>
          )}
        </section>
      </main>
    </div>
  );
}

/**
 * Form to assign an activity to multiple students. Renders a list of
 * checkboxes and submits selected IDs to the API. A callback is
 * passed in from the page to perform the mutation.
 */
function AssignForm({
  activityId,
  students,
  assign,
  disabled,
}: {
  activityId: string;
  students: Student[];
  assign: (data: { activityId: string; studentIds: string[] }) => Promise<unknown>;
  disabled: boolean;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const handleToggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id],
    );
  };
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selected.length === 0) {
      setMessage('Selecione pelo menos um aluno');
      return;
    }
    setMessage('');
    await assign({ activityId, studentIds: selected });
    setSelected([]);
    setMessage('Atividade atribuída!');
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="max-h-40 overflow-y-auto rounded border border-gray-200 p-2">
        {students.map((student) => (
          <label key={student.id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selected.includes(student.id)}
              onChange={() => handleToggle(student.id)}
              className="rounded"
            />
            <span>{student.name}</span>
          </label>
        ))}
      </div>
      {message && <p className="text-sm text-green-700">{message}</p>}
      <button
        type="submit"
        disabled={disabled}
        className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
      >
        Atribuir selecionados
      </button>
    </form>
  );
}