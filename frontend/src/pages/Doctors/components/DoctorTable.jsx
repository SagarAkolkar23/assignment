import { Eye, Pencil, Trash2 } from 'lucide-react';

export default function DoctorTable({ doctors, onView, onEdit, onDelete }) {
  if (doctors.length === 0) {
    return (
      <div className="empty-state">
        No doctors registered yet. Click &ldquo;Add Doctor&rdquo; to add one.
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
            <th>Specialization</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Experience</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor) => (
            <tr key={doctor.id}>
              <td>#{doctor.id}</td>
              <td>
                <strong>Dr. {doctor.name}</strong>
              </td>
              <td>
                <span className="badge">{doctor.specialization}</span>
              </td>
              <td>{doctor.email}</td>
              <td>{doctor.phone}</td>
              <td>{doctor.years_of_experience} yrs</td>
              <td>
                <div className="table-actions">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => onView(doctor.id)}
                    title="View details"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => onEdit(doctor)}
                    title="Edit doctor"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => onDelete(doctor)}
                    title="Delete doctor"
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
