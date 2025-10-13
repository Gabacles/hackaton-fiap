"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, hydrateAuthFromStorage } from '../../store/auth';
import api from '../../lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Assignment {
  id: string;
  status: 'PENDING' | 'COMPLETED' | 'SUBMITTED';
  submission: string | null;
  activity: {
    id: string;
    title: string;
    description: string | null;
    content: string;
  };
}

export default function AlunoPage() {
  const router = useRouter();
  const { user, token, logout } = useAuthStore();
  const queryClient = useQueryClient();
  useEffect(() => {
    hydrateAuthFromStorage();
  }, []);
  useEffect(() => {
    if (!token) return;
    if (user && user.role !== 'ALUNO') {
      router.push('/dashboard');
    }
  }, [token, user, router]);

  const {
    data: assignments,
    isLoading,
    error,
  } = useQuery<Assignment[]>(['studentActivities'], async () => {
    const res = await api.get<Assignment[]>('/activities/student');
    return res.data;
  });

  const submitMutation = useMutation(
    async ({ assignmentId, submission }: { assignmentId: string; submission: string }) => {
      const res = await api.post(`/activities/assignment/${assignmentId}/submit`, { submission });
      return res.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['studentActivities']);
      },
    },
  );

  const [submitting, setSubmitting] = useState<{ [key: string]: string }>({});
  const handleSubmit = async (assignmentId: string) => {
    const text = submitting[assignmentId];
    if (!text) return;
    await submitMutation.mutateAsync({ assignmentId, submission: text });
    setSubmitting((prev) => ({ ...prev, [assignmentId]: '' }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="mb-6 flex items-center justify-between">
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
      <main>
        <h2 className="mb-4 text-xl font-semibold">Minhas atividades</h2>
        {isLoading ? (
          <p>Carregando…</p>
        ) : error ? (
          <p className="text-red-600">Erro ao carregar atividades</p>
        ) : assignments && assignments.length > 0 ? (
          <ul className="space-y-4">
            {assignments.map((assignment) => (
              <li key={assignment.id} className="rounded-md bg-white p-4 shadow">
                <h3 className="text-lg font-bold">{assignment.activity.title}</h3>
                {assignment.activity.description && (
                  <p className="text-sm text-gray-600">{assignment.activity.description}</p>
                )}
                <p className="mt-2 whitespace-pre-line text-gray-700">
                  {assignment.activity.content}
                </p>
                <p className="mt-2 text-sm">
                  Status:{' '}
                  <span className="font-medium">
                    {assignment.status === 'PENDING'
                      ? 'Pendente'
                      : assignment.status === 'SUBMITTED'
                      ? 'Enviado'
                      : 'Concluído'}
                  </span>
                </p>
                {assignment.status === 'PENDING' && (
                  <div className="mt-3 space-y-2">
                    <textarea
                      value={submitting[assignment.id] || ''}
                      onChange={(e) =>
                        setSubmitting((prev) => ({ ...prev, [assignment.id]: e.target.value }))
                      }
                      className="w-full rounded border border-gray-300 p-2"
                      placeholder="Digite sua resposta aqui"
                      rows={3}
                    />
                    <button
                      onClick={() => handleSubmit(assignment.id)}
                      disabled={submitMutation.isLoading}
                      className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      {submitMutation.isLoading ? 'Enviando…' : 'Enviar'}
                    </button>
                  </div>
                )}
                {assignment.status === 'SUBMITTED' && assignment.submission && (
                  <div className="mt-2 rounded bg-gray-100 p-2 text-sm">
                    <p className="font-medium">Sua resposta:</p>
                    <p>{assignment.submission}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>Você não tem atividades atribuídas.</p>
        )}
      </main>
    </div>
  );
}