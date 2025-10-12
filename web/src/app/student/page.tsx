"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

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

export default function StudentPage() {
  const router = useRouter();
  const { user, logout, initialise } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: string]: number }>({});

  useEffect(() => {
    initialise();
  }, [initialise]);

  useEffect(() => {
    if (!user) return;
    if (user.role !== 'STUDENT') {
      router.push('/dashboard');
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

  const startActivity = (activity: Activity) => {
    setCurrentActivity(activity);
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  const handleAnswer = (optionIndex: number) => {
    if (!currentActivity) return;
    const question = currentActivity.questions[currentQuestionIndex];
    setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }));
    if (currentQuestionIndex + 1 < currentActivity.questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // For MVP we simply finish the quiz without persisting. Could send to API.
      alert('Quiz completed!');
      setCurrentActivity(null);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Student Workspace</h1>
        <button
          onClick={() => { logout(); router.push('/login'); }}
          className="px-4 py-2 bg-red-500 text-white rounded-md"
        >
          Logout
        </button>
      </header>
      {currentActivity ? (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-2xl font-semibold mb-4">{currentActivity.title}</h2>
          {currentActivity.questions.length === 0 ? (
            <p>No questions.</p>
          ) : (
            <div>
              <p className="font-medium">
                Question {currentQuestionIndex + 1} of {currentActivity.questions.length}
              </p>
              <p className="mt-2 mb-4">{currentActivity.questions[currentQuestionIndex].text}</p>
              <div className="space-y-2">
                {currentActivity.questions[currentQuestionIndex].options.map((opt: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    className="block w-full text-left px-4 py-2 border rounded hover:bg-gray-100"
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Activities</h2>
            {activities.length === 0 ? (
              <p>No activities available.</p>
            ) : (
              <ul className="space-y-2">
                {activities.map((a) => (
                  <li key={a.id} className="border rounded p-2 flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{a.title}</h3>
                      {a.description && <p className="text-sm text-gray-600">{a.description}</p>}
                    </div>
                    <button
                      onClick={() => startActivity(a)}
                      className="px-3 py-1 bg-blue-600 text-white rounded"
                    >
                      Start
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">Resources</h2>
            {resources.length === 0 ? (
              <p>No resources available.</p>
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
          </section>
        </>
      )}
    </div>
  );
}