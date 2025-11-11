// App.jsx - Main application component

import React, { useState } from 'react';
import { BugProvider } from './context/BugContext';
import Header from './components/Header';
import BugList from './components/BugList';
import BugForm from './components/BugForm';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [editingBug, setEditingBug] = useState(null);

  const handleNewBug = () => {
    setEditingBug(null);
    setShowForm(true);
  };

  const handleEditBug = (bug) => {
    setEditingBug(bug);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingBug(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingBug(null);
  };

  return (
    <ErrorBoundary showHomeButton={true}>
      <BugProvider>
        <div className="app">
          <ErrorBoundary>
            <Header />
          </ErrorBoundary>
          <main className="app-main">
            <div className="app-container">
              <ErrorBoundary
                message="An error occurred while displaying the bug list. Please try again."
                onReset={() => {
                  setShowForm(false);
                  setEditingBug(null);
                }}
              >
                {!showForm ? (
                  <>
                    <div className="app-actions">
                      <button className="btn btn-primary" onClick={handleNewBug}>
                        + Report New Bug
                      </button>
                    </div>
                    <BugList onEditBug={handleEditBug} />
                  </>
                ) : (
                  <ErrorBoundary
                    message="An error occurred while displaying the form. Please try again."
                    onReset={handleCancelForm}
                  >
                    <BugForm
                      bug={editingBug}
                      onCancel={handleCancelForm}
                      onSuccess={handleFormSuccess}
                    />
                  </ErrorBoundary>
                )}
              </ErrorBoundary>
            </div>
          </main>
        </div>
      </BugProvider>
    </ErrorBoundary>
  );
}

export default App;

