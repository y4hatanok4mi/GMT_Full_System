interface ServerActionResponse {
    success: boolean
    message: string
}

interface User {
    id: string;
    name: string;
    email: string;
    image: string | null;
    password: string;
    birthday: Date;
    gender: string;
    school: string;
    role: string;
    id_no: string;
  };