"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

interface Activity {
  id: string;
  title: string;
  description?: string;
  questions: { id: string; text: string; options: any[] }[];
}

interface Resource {
  id: string;
  title: string;
  url: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, initialise } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [resTitle, setResTitle] = useState('');
  const [resUrl, setResUrl] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [questionOptions, setQuestionOptions] = useState('');
  const [selectedActivity, setSelectedActivity] = useState<string>('');

  useEffect(() => {
    initialise();
  }, [initialise]);

  useEffect(() => {
    if (!user) return;
    if (user.role !== 'TEACHER') {
      router.push('/student');
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    const [actRes, resRes] = await Promise.all([
      api.get<Activity[]>('/activities'),
      api.get<Resource[]>('/resources'),
    ]);
    setActivities(actRes.data);
    setResources(resRes.data);
  };

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/activities', { title, description });
    setTitle('');
    setDescription('');
    fetchData();
  };

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/resources', { title: resTitle, url: resUrl });
    setResTitle('');
    setResUrl('');
    fetchData();
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    const optionsArr = questionOptions.split(',').map((opt) => ({ text: opt.trim(), correct: false }));
    await api.post('/activities/question', {
      activityId: selectedActivity,
      text: questionText,
      options: optionsArr,
    });
    setQuestionText('');
    setQuestionOptions('');
    fetchData();
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
        <button
          onClick={() => { logout(); router.push('/login'); }}
          className="px-4 py-2 bg-red-500 text-white rounded-md"
        >
          Logout
        </button>
      </header>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Activity creation */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Create Activity</h2>
          <form onSubmit={handleCreateActivity} className="space-y-2">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            ></textarea>
            <button className="px-4 py-2 bg-blue-600 text-white rounded w-full">Create</button>
          </form>
        </div>
        {/* Resource creation */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Share Resource</h2>
          <form onSubmit={handleCreateResource} className="space-y-2">
            <input
              type="text"
              placeholder="Title"
              value={resTitle}
              onChange={(e) => setResTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
            <input
              type="url"
              placeholder="URL"
              value={resUrl}
              onChange={(e) => setResUrl(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded w-full">Share</button>
          </form>
        </div>
      </section>
      {/* Add question */}
      <section className="bg-white p-4 rounded shadow my-6">
        <h2 className="text-xl font-semibold mb-2">Add Question</h2>
        <form onSubmit={handleAddQuestion} className="space-y-2">
          <select
            value={selectedActivity}
            onChange={(e) => setSelectedActivity(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select activity</option>
            {activities.map((a) => (
              <option key={a.id} value={a.id}>{a.title}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Question text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="text"
            placeholder="Options (comma separated)"
            value={questionOptions}
            onChange={(e) => setQuestionOptions(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded w-full">Add Question</button>
        </form>
      </section>
      {/* Lists */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Activities</h2>
          {activities.length === 0 ? (
            <p>No activities yet.</p>
          ) : (
            <ul className="space-y-2">
              {activities.map((a) => (
                <li key={a.id} className="border rounded p-2">
                  <h3 className="font-semibold">{a.title}</h3>
                  {a.description && <p className="text-sm text-gray-600">{a.description}</p>}
                  <p className="text-sm mt-1">Questions: {a.questions.length}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Resources</h2>
          {resources.length === 0 ? (
            <p>No resources yet.</p>
          ) : (
            <ul className="space-y-2">
              {resources.map((r) => (
                <li key={r.id} className="border rounded p-2">
                  <a href={r.url} target="_blank" className="font-semibold text-blue-700 hover:underline">
                    {r.title}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}