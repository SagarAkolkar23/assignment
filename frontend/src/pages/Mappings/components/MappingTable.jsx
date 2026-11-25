import { Trash2 } from 'lucide-react';

export default function MappingTable({ mappings, onDelete }) {
  if (mappings.length === 0) {
    return (
      <div className="empty-state">
        No patient-doctor mappings found.
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Mapping ID</th>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Specialization</th>
            <th>Notes</th>
            <th>Assigned At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {mappings.map((mapping) => (
            <tr key={mapping.id}>
              <td>#{mapping.id}</td>
              <td>
                <strong>{mapping.patient_name}</strong> (#{mapping.patient})
              </td>
              <td>Dr. {mapping.doctor_details?.name || mapping.doctor}</td>
              <td>
                <span className="badge">
                  {mapping.doctor_details?.specialization || 'N/A'}
                </span>
              </td>
              <td>{mapping.notes || '—'}</td>
              <td>{new Date(mapping.assigned_at).toLocaleDateString()}</td>
              <td>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => onDelete(mapping)}
                  title="Remove assignment"
                >
                  <Trash2 size={14} />
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
