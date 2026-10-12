import { TONES } from '@inflate-ai/imaxt-core';
import type { JSX } from 'react';
import type { FieldConfig } from './block-config.ts';

type AnyData = Record<string, unknown>;

function toControlValue(data: AnyData, field: FieldConfig): string {
  const raw = data[field.name];
  if (field.arrayOf) {
    const arr = (raw as unknown[]) ?? [];
    return arr.join(field.separator ?? '\n');
  }
  if (raw === undefined || raw === null) return '';
  return String(raw);
}

function fromControlValue(field: FieldConfig, text: string): unknown {
  if (field.arrayOf) {
    const separator = field.separator ?? '\n';
    const parts = text
      .split(separator)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    return field.arrayOf === 'number' ? parts.map(Number) : parts;
  }
  if (field.kind === 'number') return text === '' ? undefined : Number(text);
  return text === '' ? undefined : text;
}

function setField(data: AnyData, field: FieldConfig, value: unknown): AnyData {
  return { ...data, [field.name]: value };
}

export function FieldInput({
  field,
  data,
  onChange,
}: {
  field: FieldConfig;
  data: AnyData;
  onChange: (next: AnyData) => void;
}): JSX.Element {
  if (field.kind === 'boolean') {
    return (
      <label className="imx-ed-field imx-ed-field-checkbox">
        <input
          type="checkbox"
          checked={Boolean(data[field.name])}
          onChange={(e) => onChange(setField(data, field, e.target.checked || undefined))}
        />
        {field.label}
      </label>
    );
  }

  if (field.kind === 'tone') {
    return (
      <label className="imx-ed-field">
        <span>{field.label}</span>
        <select
          value={String(data[field.name] ?? '')}
          onChange={(e) => onChange(setField(data, field, e.target.value || undefined))}
        >
          <option value="">(default)</option>
          {TONES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (field.kind === 'select') {
    return (
      <label className="imx-ed-field">
        <span>{field.label}</span>
        <select
          value={String(data[field.name] ?? '')}
          onChange={(e) => onChange(setField(data, field, e.target.value || undefined))}
        >
          <option value="">(default)</option>
          {(field.options ?? []).map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (field.kind === 'textarea') {
    return (
      <label className="imx-ed-field imx-ed-field-wide">
        <span>{field.label}</span>
        <textarea
          value={toControlValue(data, field)}
          onChange={(e) => onChange(setField(data, field, fromControlValue(field, e.target.value)))}
        />
      </label>
    );
  }

  if (field.kind === 'list') {
    const items = (data[field.name] as AnyData[]) ?? [];
    return (
      <div className="imx-ed-field imx-ed-field-wide imx-ed-list">
        <span>{field.label}</span>
        {items.map((item, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: these rows have no stable id and are addressed by index for add/remove
          <div className="imx-ed-list-item" key={index}>
            {(field.itemFields ?? []).map((itemField) => (
              <FieldInput
                key={itemField.name}
                field={itemField}
                data={item}
                onChange={(nextItem) => {
                  const next = items.slice();
                  next[index] = nextItem;
                  onChange(setField(data, field, next));
                }}
              />
            ))}
            <button
              type="button"
              className="imx-ed-list-remove"
              onClick={() => {
                const next = items.slice();
                next.splice(index, 1);
                onChange(setField(data, field, next));
              }}
            >
              Remove {field.itemLabel ?? 'item'}
            </button>
          </div>
        ))}
        <button
          type="button"
          className="imx-ed-list-add"
          onClick={() => onChange(setField(data, field, [...items, {}]))}
        >
          + Add {field.itemLabel ?? 'item'}
        </button>
      </div>
    );
  }

  return (
    <label className="imx-ed-field">
      <span>{field.label}</span>
      <input
        type="text"
        value={toControlValue(data, field)}
        onChange={(e) => onChange(setField(data, field, fromControlValue(field, e.target.value)))}
      />
    </label>
  );
}

export function GenericBlockForm({
  fields,
  data,
  onChange,
}: {
  fields: readonly FieldConfig[];
  data: AnyData;
  onChange: (next: AnyData) => void;
}): JSX.Element {
  return (
    <div className="imx-ed-form">
      {fields.map((field) => (
        <FieldInput key={field.name} field={field} data={data} onChange={onChange} />
      ))}
    </div>
  );
}
