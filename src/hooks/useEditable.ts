import { useState, useEffect } from 'react';
import { getPageEdit } from '../services/adminService';

export interface EditableFields {
  title: string;
  subtitle: string;
  description: string;
}

export function useEditable(pageKey: string, defaultFields: EditableFields): EditableFields {
  const [fields, setFields] = useState<EditableFields>(() => {
    return getPageEdit(pageKey, defaultFields) as EditableFields;
  });

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail === pageKey || !customEvent.detail) {
        setFields(getPageEdit(pageKey, defaultFields) as EditableFields);
      }
    };

    const handleStorageUpdate = () => {
      setFields(getPageEdit(pageKey, defaultFields) as EditableFields);
    };

    window.addEventListener('page-contents-edited', handleUpdate as EventListener);
    window.addEventListener('storage', handleStorageUpdate);

    return () => {
      window.removeEventListener('page-contents-edited', handleUpdate as EventListener);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, [pageKey, defaultFields]);

  return fields;
}
