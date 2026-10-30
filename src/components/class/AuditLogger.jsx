import React, { Component } from 'react';
import CardWrapper from '../functional/CardWrapper';

/**
 * AuditLogger Class Component (Task 3)
 * Demonstrates proficiency with legacy React Class Components and Lifecycle Methods:
 * - constructor(props) initializes this.state explicitly
 * - componentDidMount(): Reads persisted audit logs from localStorage & sets up global event listeners
 * - componentDidUpdate(prevProps, prevState): Persists newly added audit logs to localStorage
 *   and triggers visual/toast notifications with auto-dismiss timers
 * - componentWillUnmount(): Performs cleanups (clears active timeouts & unsubscribes event listeners)
 * - Uses this.state and this.setState() exclusively
 */
export class AuditLogger extends Component {
  constructor(props) {
    super(props);

    // Explicit state initialization (Task 3)
    this.state = {
      logs: [],
      activeToast: null,
      filterType: 'ALL',
      isCollapsed: false,
    };

    // Ref for toast timer and event handlers
    this.toastTimeout = null;
    this.handleWindowResize = this.handleWindowResize.bind(this);
    this.handleClearLogs = this.handleClearLogs.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.dismissToast = this.dismissToast.bind(this);
  }

  /**
   * Lifecycle: componentDidMount
   * Task 3: Retrieve initial audit logs stored in browser localStorage
   * and initialize global listeners.
   */
  componentDidMount() {
    try {
      const stored = localStorage.getItem('audit_logs');
      if (stored) {
        const parsedLogs = JSON.parse(stored);
        if (Array.isArray(parsedLogs) && parsedLogs.length > 0) {
          this.setState({ logs: parsedLogs });
        } else {
          this.seedInitialLog();
        }
      } else {
        this.seedInitialLog();
      }
    } catch (error) {
      console.error('AuditLogger: Failed to load logs from localStorage', error);
      this.seedInitialLog();
    }

    // Subscribe to window event to demonstrate componentWillUnmount cleanup
    window.addEventListener('resize', this.handleWindowResize);
  }

  seedInitialLog() {
    const initialLog = {
      id: `log-init-${Date.now()}`,
      type: 'SYSTEM',
      action: 'SYSTEM_READY',
      description: 'Audit logging module initialized. Monitoring all inventory events.',
      timestamp: new Date().toISOString(),
    };
    this.setState({ logs: [initialLog] });
  }

  handleWindowResize() {
    // Demonstration of a global event listener that requires cleanup on unmount
  }

  /**
   * Lifecycle: componentDidUpdate
   * Task 3: Persist newly added audit logs to localStorage and trigger visual/toast notifications.
   */
  componentDidUpdate(prevProps, prevState) {
    // Check if a new action prop was passed from the parent component
    if (
      this.props.latestAction &&
      this.props.latestAction !== prevProps.latestAction
    ) {
      const newAction = this.props.latestAction;

      this.setState(
        (prevState) => {
          const updatedLogs = [newAction, ...prevState.logs];
          return {
            logs: updatedLogs,
            activeToast: {
              id: newAction.id,
              type: newAction.type,
              message: newAction.description,
              timestamp: newAction.timestamp,
            },
          };
        },
        () => {
          // Persist logs to localStorage immediately after state update
          try {
            localStorage.setItem(
              'audit_logs',
              JSON.stringify(this.state.logs)
            );
          } catch (e) {
            console.error('AuditLogger: Failed to persist to localStorage', e);
          }

          // Trigger auto-dismiss timer for toast notification
          if (this.toastTimeout) {
            clearTimeout(this.toastTimeout);
          }
          this.toastTimeout = setTimeout(() => {
            this.setState({ activeToast: null });
          }, 3500);
        }
      );
    }

    // If logs changed via local state (e.g. cleared), keep localStorage synchronized
    if (prevState.logs !== this.state.logs && !this.props.latestAction) {
      try {
        localStorage.setItem(
          'audit_logs',
          JSON.stringify(this.state.logs)
        );
      } catch (e) {
        console.error('AuditLogger: Failed to persist logs', e);
      }
    }
  }

  /**
   * Lifecycle: componentWillUnmount
   * Task 3: Perform necessary cleanups (clear timers, remove event listeners)
   */
  componentWillUnmount() {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
      this.toastTimeout = null;
    }
    window.removeEventListener('resize', this.handleWindowResize);
  }

  handleClearLogs() {
    if (window.confirm('Are you sure you want to clear the audit history?')) {
      this.setState({ logs: [], activeToast: null }, () => {
        try {
          localStorage.removeItem('audit_logs');
        } catch (e) {
          console.error(e);
        }
      });
    }
  }

  handleFilterChange(e) {
    this.setState({ filterType: e.target.value });
  }

  dismissToast() {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    this.setState({ activeToast: null });
  }

  getActionBadgeClass(type) {
    switch (type) {
      case 'ADD':
        return 'badge-log-add';
      case 'UPDATE':
      case 'STOCK':
        return 'badge-log-update';
      case 'DELETE':
        return 'badge-log-delete';
      case 'SYSTEM':
      default:
        return 'badge-log-system';
    }
  }

  formatTime(isoString) {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return '';
    }
  }

  render() {
    const { logs, activeToast, filterType } = this.state;

    // Filter logs based on local state selection
    const filteredLogs = logs.filter((log) => {
      if (filterType === 'ALL') return true;
      return log.type === filterType;
    });

    return (
      <CardWrapper
        title="Inventory Audit Logger"
        subtitle="Class Component with componentDidMount & componentDidUpdate lifecycle tracking"
        badge={`${logs.length} Operations`}
        actions={
          <div className="audit-header-actions">
            <select
              value={filterType}
              onChange={this.handleFilterChange}
              className="audit-filter-select"
              aria-label="Filter audit logs by operation type"
            >
              <option value="ALL">All Actions</option>
              <option value="ADD">Additions</option>
              <option value="STOCK">Stock Changes</option>
              <option value="UPDATE">Edits</option>
              <option value="DELETE">Deletions</option>
              <option value="SYSTEM">System</option>
            </select>
            {logs.length > 0 && (
              <button
                type="button"
                onClick={this.handleClearLogs}
                className="btn btn-secondary btn-sm"
                title="Clear audit log history"
              >
                Clear History
              </button>
            )}
          </div>
        }
        className="audit-logger-card"
      >
        {/* Visual Toast Notification Triggered by componentDidUpdate (Task 3) */}
        {activeToast && (
          <div
            className={`audit-toast-banner ${this.getActionBadgeClass(
              activeToast.type
            )}`}
            role="status"
            aria-live="polite"
          >
            <div className="toast-content">
              <span className="toast-icon">⚡</span>
              <div className="toast-text">
                <strong className="toast-title">Audit Event Logged:</strong>
                <span className="toast-message"> {activeToast.message}</span>
              </div>
            </div>
            <button
              type="button"
              className="toast-dismiss-btn"
              onClick={this.dismissToast}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        )}

        {/* Logs Feed */}
        <div className="audit-logs-feed" tabIndex="0" aria-label="Audit log entries">
          {filteredLogs.length === 0 ? (
            <div className="empty-logs">
              <p>No audit log events recorded for the selected filter.</p>
            </div>
          ) : (
            <ul className="audit-logs-list">
              {filteredLogs.map((log) => (
                <li key={log.id} className="audit-log-item">
                  <div className="log-item-header">
                    <span
                      className={`log-badge ${this.getActionBadgeClass(
                        log.type
                      )}`}
                    >
                      {log.type}
                    </span>
                    <time
                      dateTime={log.timestamp}
                      className="log-timestamp"
                    >
                      {this.formatTime(log.timestamp)}
                    </time>
                  </div>
                  <p className="log-description">{log.description}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardWrapper>
    );
  }
}

export default AuditLogger;
