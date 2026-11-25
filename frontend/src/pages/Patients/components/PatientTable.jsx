import { Eye, Pencil, Trash2 } from 'lucide-react';

export default function PatientTable({ patients, onView, onEdit, onDelete }) {
  if (patients.length === 0) {
    return (
      <div className="empty-state">
        No patients found. Click &ldquo;Add Patient&rdquo; to create your first record.
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td>#{patient.id}</td>
              <td>
                <strong>{patient.name}</strong>
              </td>
              <td>{patient.age}</td>
              <td>
                <span className="badge">{patient.gender}</span>
              </td>
              <td>{patient.phone}</td>
              <td>{patient.email || '—'}</td>
              <td>
                <div className="table-actions">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => onView(patient.id)}
                    title="View details"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => onEdit(patient)}
                    title="Edit patient"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => onDelete(patient)}
                    title="Delete patient"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
