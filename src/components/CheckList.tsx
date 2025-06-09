import { useEffect, useState } from 'react';
import { Check, Circle } from 'lucide-react';
import { RelationCollaborators } from '../pages/DashBoard';

interface Props {
  assignments: RelationCollaborators[];
}

export default function ChecklistFromAssignments({ assignments }: Props) {
  const [items, setItems] = useState<{ id: string; text: string; done: boolean; deadline: Date }[]>([]);

  useEffect(() => {
    if (assignments && assignments.length > 0) {
      const formatted = assignments.map((a) => ({
        id: a.id,
        text: `${a.task} ${a.nameCollaborator ? '— ' + a.nameCollaborator : ''}  `,
        done: a.status === 'COMPLETO',
        deadline: a.assignedAt
      }));
      setItems(formatted);
    }
  }, [assignments]);

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  };

  return (
    <div className=" bg-white rounded-xl shadow max-w-md p-5 m-3 ">
      <h2 className="text-lg font-bold text-gray-800 mb-2">Checklist de Tarefas</h2>
     <ul className="space-y-2 ">

        {items.length > 0 ? (
          items.slice().sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime()).map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => toggleItem(item.id)}
            >
              {item.done ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400 group-hover:text-blue-400" />
              )}
              <span
                className={`text-sm ${
                  item.done ? 'line-through text-gray-500' : 'text-gray-800'
                }`}
              >
                {item.text}
              </span>
            </li>
          ))
        ) : (
          <p className="text-sm text-gray-500 italic">Nenhuma tarefa atribuída</p>
        )}
      </ul>
    </div>
  );
}
