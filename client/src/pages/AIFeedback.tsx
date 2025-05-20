import React, { useState, useEffect } from 'react';

interface ProgressItem {
  timestamp: string;
  task: string;
  status: 'completed' | 'in-progress' | 'planned';
  details?: string;
}

interface FeedbackItem {
  timestamp: string;
  type: 'error' | 'suggestion' | 'feedback';
  message: string;
  context?: string;
}

interface AIFeedback {
  feedback: string;
  suggestions: string[];
  nextSteps: string[];
}

const AIFeedback: React.FC = () => {
  const [projectState, setProjectState] = useState<{
    progress: ProgressItem[];
    feedback: FeedbackItem[];
    lastSyncTime: string | null;
  } | null>(null);
  
  const [aiFeedback, setAIFeedback] = useState<AIFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [trackingForm, setTrackingForm] = useState({
    task: '',
    status: 'in-progress' as 'completed' | 'in-progress' | 'planned',
    details: ''
  });
  const [feedbackForm, setFeedbackForm] = useState({
    type: 'feedback' as 'error' | 'suggestion' | 'feedback',
    message: '',
    context: ''
  });

  // Fetch project state
  const fetchProjectState = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/openai/state');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch project state');
      }
      
      setProjectState(data.data);
    } catch (err) {
      setError((err as Error).message || 'An error occurred while fetching project state');
    } finally {
      setIsLoading(false);
    }
  };

  // Track progress
  const trackProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsTracking(true);
      setError(null);
      
      const response = await fetch('/api/openai/track-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(trackingForm)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to track progress');
      }
      
      // Reset form and refresh data
      setTrackingForm({
        task: '',
        status: 'in-progress',
        details: ''
      });
      
      await fetchProjectState();
    } catch (err) {
      setError((err as Error).message || 'An error occurred while tracking progress');
    } finally {
      setIsTracking(false);
    }
  };

  // Track feedback
  const trackFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsTracking(true);
      setError(null);
      
      const response = await fetch('/api/openai/track-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(feedbackForm)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to track feedback');
      }
      
      // Reset form and refresh data
      setFeedbackForm({
        type: 'feedback',
        message: '',
        context: ''
      });
      
      await fetchProjectState();
    } catch (err) {
      setError((err as Error).message || 'An error occurred while tracking feedback');
    } finally {
      setIsTracking(false);
    }
  };

  // Sync with OpenAI
  const syncWithOpenAI = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/openai/sync', {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to sync with OpenAI');
      }
      
      setAIFeedback(data.data);
      await fetchProjectState(); // Refresh state after sync
    } catch (err) {
      setError((err as Error).message || 'An error occurred while syncing with OpenAI');
    } finally {
      setIsLoading(false);
    }
  };

  // Clear tracked data
  const clearTrackedData = async () => {
    if (!confirm('Are you sure you want to clear all tracked data? This action cannot be undone.')) {
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/openai/clear', {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to clear tracked data');
      }
      
      // Reset state
      setProjectState({
        progress: [],
        feedback: [],
        lastSyncTime: null
      });
      
      setAIFeedback(null);
    } catch (err) {
      setError((err as Error).message || 'An error occurred while clearing tracked data');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch initial data
  useEffect(() => {
    fetchProjectState();
  }, []);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">ChatGPT Integration & Feedback</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-card shadow-sm rounded-lg p-6 border sticky top-20 space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Track Progress</h3>
              <form onSubmit={trackProgress} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Task</label>
                  <input
                    type="text"
                    value={trackingForm.task}
                    onChange={(e) => setTrackingForm({ ...trackingForm, task: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Status</label>
                  <select
                    value={trackingForm.status}
                    onChange={(e) => setTrackingForm({ ...trackingForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    required
                  >
                    <option value="planned">Planned</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Details (Optional)</label>
                  <textarea
                    value={trackingForm.details}
                    onChange={(e) => setTrackingForm({ ...trackingForm, details: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    rows={3}
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white brand-gradient-bg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                  disabled={isTracking}
                >
                  {isTracking ? 'Tracking...' : 'Track Progress'}
                </button>
              </form>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Track Feedback</h3>
              <form onSubmit={trackFeedback} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Type</label>
                  <select
                    value={feedbackForm.type}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, type: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    required
                  >
                    <option value="feedback">Feedback</option>
                    <option value="suggestion">Suggestion</option>
                    <option value="error">Error</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Message</label>
                  <textarea
                    value={feedbackForm.message}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    rows={3}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Context (Optional)</label>
                  <input
                    type="text"
                    value={feedbackForm.context}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, context: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                  disabled={isTracking}
                >
                  {isTracking ? 'Tracking...' : 'Track Feedback'}
                </button>
              </form>
            </div>
            
            <div className="pt-4 border-t flex flex-col space-y-4">
              <button
                onClick={syncWithOpenAI}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white brand-gradient-bg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Syncing...' : 'Get AI Feedback'}
              </button>
              
              <button
                onClick={clearTrackedData}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-destructive hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-destructive disabled:opacity-50"
                disabled={isLoading}
              >
                Clear All Data
              </button>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2 space-y-8">
          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          {aiFeedback && (
            <div className="bg-card shadow-sm rounded-lg p-6 border space-y-4">
              <h3 className="text-lg font-medium">AI Feedback</h3>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Overall Analysis</h4>
                <p className="text-sm">{aiFeedback.feedback}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Suggestions</h4>
                <ul className="list-disc list-inside space-y-1">
                  {aiFeedback.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm">{suggestion}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Recommended Next Steps</h4>
                <ol className="list-decimal list-inside space-y-1">
                  {aiFeedback.nextSteps.map((step, index) => (
                    <li key={index} className="text-sm">{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          )}
          
          {projectState && (
            <>
              <div className="bg-card shadow-sm rounded-lg p-6 border">
                <h3 className="text-lg font-medium mb-4">Project Progress</h3>
                {projectState.progress.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No progress tracked yet.</p>
                ) : (
                  <div className="max-h-96 overflow-y-auto">
                    <table className="min-w-full divide-y divide-border">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Time</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Task</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {projectState.progress.map((item, index) => (
                          <tr key={index} className="hover:bg-muted/50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm">{formatDate(item.timestamp)}</td>
                            <td className="px-4 py-3 text-sm">{item.task}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                item.status === 'completed' ? 'bg-green-100 text-green-800' :
                                item.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">{item.details || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              
              <div className="bg-card shadow-sm rounded-lg p-6 border">
                <h3 className="text-lg font-medium mb-4">Tracked Feedback</h3>
                {projectState.feedback.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No feedback tracked yet.</p>
                ) : (
                  <div className="max-h-96 overflow-y-auto">
                    <table className="min-w-full divide-y divide-border">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Time</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Message</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Context</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {projectState.feedback.map((item, index) => (
                          <tr key={index} className="hover:bg-muted/50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm">{formatDate(item.timestamp)}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                item.type === 'feedback' ? 'bg-green-100 text-green-800' :
                                item.type === 'suggestion' ? 'bg-blue-100 text-blue-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {item.type}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">{item.message}</td>
                            <td className="px-4 py-3 text-sm">{item.context || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>Last synced with OpenAI: {projectState.lastSyncTime ? formatDate(projectState.lastSyncTime) : 'Never'}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIFeedback;