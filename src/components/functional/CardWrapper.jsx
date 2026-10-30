import React from 'react';

/**
 * CardWrapper Component
 * A reusable container component leveraging React Children (props.children)
 * to provide uniform structure, padding, border, and elevation across the application.
 */
export const CardWrapper = ({
  title,
  subtitle,
  badge,
  actions,
  children,
  footer,
  className = '',
  id,
}) => {
  const hasHeader = title || subtitle || badge || actions;

  return (
    <section className={`card-wrapper ${className}`} id={id}>
      {hasHeader && (
        <header className="card-wrapper-header">
          <div className="card-wrapper-titles">
            {title && (
              <h3 className="card-wrapper-title">
                {title}
                {badge && <span className="card-wrapper-badge">{badge}</span>}
              </h3>
            )}
            {subtitle && <p className="card-wrapper-subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="card-wrapper-actions">{actions}</div>}
        </header>
      )}

      <div className="card-wrapper-body">{children}</div>

      {footer && <footer className="card-wrapper-footer">{footer}</footer>}
    </section>
  );
};

export default CardWrapper;
