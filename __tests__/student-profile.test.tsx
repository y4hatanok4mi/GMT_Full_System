import { render, screen } from '@testing-library/react';
import StudentProfileClient from '@/components/(user)/student/student-profile';

describe('StudentProfileClient', () => {
  const mockProfile = {
    id: 1,
    name: 'Alice Test',
    email: 'alice@example.com',
    school: 'Test High School',
    id_no: 'TST1234',
    birthday: new Date('2006-08-15'),
    image: null,
  };

  it('renders student profile information correctly', () => {
    render(<StudentProfileClient profile={mockProfile} />);

    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Name: Alice Test')).toBeInTheDocument();
    expect(screen.getByText('Email: alice@example.com')).toBeInTheDocument();
    expect(screen.getByText('School: Test High School')).toBeInTheDocument();
    expect(screen.getByText('ID Number: TST1234')).toBeInTheDocument();
    expect(screen.getByText('Birthday: August 15, 2006')).toBeInTheDocument();

    const image = screen.getByAltText('Profile') as HTMLImageElement;
    expect(image.src).toContain('url=%2Fuser.png');
  });

  it('uses provided image when available', () => {
    const profileWithImage = {
      ...mockProfile,
      image: '/custom-image.jpg',
    };

    render(<StudentProfileClient profile={profileWithImage} />);

    const image = screen.getByAltText('Profile') as HTMLImageElement;
    expect(image.src).toContain('url=%2Fcustom-image.jpg');
  });
});
