import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

// ---------- Badge ----------

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('applies default slate color classes', () => {
    render(<Badge>Default</Badge>);
    const el = screen.getByText('Default');
    expect(el.className).toContain('bg-slate-50');
    expect(el.className).toContain('text-slate-600');
  });

  it('applies the correct color classes for blue', () => {
    render(<Badge color="blue">Info</Badge>);
    const el = screen.getByText('Info');
    expect(el.className).toContain('bg-sky-50');
    expect(el.className).toContain('text-sky-700');
  });

  it('applies the correct color classes for emerald', () => {
    render(<Badge color="emerald">Success</Badge>);
    const el = screen.getByText('Success');
    expect(el.className).toContain('bg-emerald-50');
    expect(el.className).toContain('text-emerald-700');
  });

  it('renders an icon when provided', () => {
    render(
      <Badge icon={<span data-testid="badge-icon">*</span>}>
        With Icon
      </Badge>
    );
    expect(screen.getByTestId('badge-icon')).toBeInTheDocument();
    expect(screen.getByText('With Icon')).toBeInTheDocument();
  });

  it('merges custom className', () => {
    render(<Badge className="my-custom-class">Custom</Badge>);
    const el = screen.getByText('Custom');
    expect(el.className).toContain('my-custom-class');
  });
});

// ---------- Card ----------

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders as a div with base classes', () => {
    render(<Card>Base</Card>);
    const el = screen.getByText('Base');
    expect(el.className).toContain('bg-white');
    expect(el.className).toContain('rounded-2xl');
    expect(el.className).toContain('border');
  });

  it('does not apply hover classes by default', () => {
    render(<Card>No hover</Card>);
    const el = screen.getByText('No hover');
    expect(el.className).not.toContain('hover:shadow-md');
  });

  it('applies hover classes when hover=true', () => {
    render(<Card hover>Hoverable</Card>);
    const el = screen.getByText('Hoverable');
    expect(el.className).toContain('hover:shadow-md');
    expect(el.className).toContain('hover:border-slate-300');
  });

  it('merges custom className', () => {
    render(<Card className="extra-class">Merged</Card>);
    const el = screen.getByText('Merged');
    expect(el.className).toContain('extra-class');
  });
});

// ---------- EmptyState ----------

describe('EmptyState', () => {
  it('renders icon, title, and subtitle', () => {
    render(
      <EmptyState
        icon={<span data-testid="empty-icon">!</span>}
        title="No results"
        subtitle="Try a different search"
      />
    );
    expect(screen.getByTestId('empty-icon')).toBeInTheDocument();
    expect(screen.getByText('No results')).toBeInTheDocument();
    expect(screen.getByText('Try a different search')).toBeInTheDocument();
  });

  it('hides subtitle when not provided', () => {
    render(
      <EmptyState
        icon={<span data-testid="empty-icon">!</span>}
        title="No results"
      />
    );
    expect(screen.getByText('No results')).toBeInTheDocument();
    expect(screen.queryByText('Try a different search')).not.toBeInTheDocument();
  });

  it('renders action when provided', () => {
    render(
      <EmptyState
        icon={<span>!</span>}
        title="Empty"
        action={<button>Retry</button>}
      />
    );
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  it('does not render action when not provided', () => {
    render(
      <EmptyState
        icon={<span>!</span>}
        title="Empty"
      />
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

// ---------- Input ----------

describe('Input', () => {
  it('renders with a label', () => {
    render(<Input label="Email" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders without a label when not provided', () => {
    const { container } = render(<Input placeholder="Type here" />);
    expect(container.querySelector('label')).toBeNull();
  });

  it('renders with an icon', () => {
    render(<Input icon={<span data-testid="input-icon">@</span>} />);
    expect(screen.getByTestId('input-icon')).toBeInTheDocument();
  });

  it('adds pl-11 class when icon is present', () => {
    const { container } = render(
      <Input icon={<span>@</span>} />
    );
    const input = container.querySelector('input');
    expect(input?.className).toContain('pl-11');
  });

  it('applies custom className to the input element', () => {
    const { container } = render(<Input className="custom-input" />);
    const input = container.querySelector('input');
    expect(input?.className).toContain('custom-input');
  });

  it('passes through HTML input attributes', () => {
    render(<Input placeholder="Enter email" type="email" />);
    const input = screen.getByPlaceholderText('Enter email');
    expect(input).toHaveAttribute('type', 'email');
  });
});

// ---------- Button ----------

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('renders as a button element', () => {
    render(<Button>Submit</Button>);
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('applies primary variant classes by default', () => {
    render(<Button>Primary</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('bg-gray-900');
    expect(btn.className).toContain('text-white');
  });

  it('applies secondary variant classes', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('bg-white');
    expect(btn.className).toContain('text-gray-700');
  });

  it('applies ghost variant classes', () => {
    render(<Button variant="ghost">Ghost</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('bg-transparent');
    expect(btn.className).toContain('text-gray-600');
  });

  it('applies danger variant classes', () => {
    render(<Button variant="danger">Delete</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('bg-red-600');
  });

  it('applies size classes', () => {
    render(<Button size="sm">Small</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('px-3.5');
    expect(btn.className).toContain('text-xs');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is disabled when loading is true', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('merges custom className', () => {
    render(<Button className="w-full">Full width</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('w-full');
  });
});
