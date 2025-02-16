import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function exportUsersToPDF(users: Array<{ name: string; email: string; gender: string; school: string; id_no: string; role: string }>) {
  const doc = new jsPDF();

  // Title
  doc.text('Users Report', 14, 10);

  // Table
  const tableData = users.map((user) => [ user.name, user.email, user.gender, user.school, user.id_no, user.role]);
  autoTable(doc, {
    head: [[ 'Name', 'Email', 'Gender', 'School', 'ID No.', 'Role']],
    body: tableData,
    startY: 20,
  });

  // Save PDF
  doc.save('users_report.pdf');
}