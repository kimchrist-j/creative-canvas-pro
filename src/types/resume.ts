export interface ResumeData {
  personalInfo: {
    firstName: string;
    lastName: string;
    title: string;
    email: string;
    phone: string;
    city: string;
    photo: string;
  };
  profile: string;
  education: Array<{
    id: string;
    startYear: string;
    endYear: string;
    degree: string;
    institution: string;
  }>;
  experience: Array<{
    id: string;
    startYear: string;
    endYear: string;
    jobTitle: string;
    company: string;
    description: string;
  }>;
  skills: string[];
  hobbies: string[];
  websites: Array<{ id: string; label: string; url: string }>;
}

export const defaultResumeData: ResumeData = {
  personalInfo: {
    firstName: 'David',
    lastName: 'St. Peter',
    title: 'UX Designer',
    email: 'yourname@gmail.com',
    phone: '+000 123 456 789',
    city: 'New York',
    photo: '',
  },
  profile: 'For more Sales, Leads, Customer Engagement. Become an Author, Create Information Products. All done quickly and easily. No Design or Technical skills necessary.',
  education: [
    { id: '1', startYear: '2014', endYear: '2016', degree: 'Degree Name', institution: 'University name here' },
    { id: '2', startYear: '2010', endYear: '2014', degree: 'Degree Name', institution: 'University name here' },
    { id: '3', startYear: '2008', endYear: '2010', degree: 'Degree Name', institution: 'University name here' },
  ],
  experience: [
    { id: '1', startYear: '2020', endYear: 'Present', jobTitle: 'Senior UX Designer', company: 'Company Name', description: 'Lorem ipsum is simply dummy text of the printing and typesetting industry.' },
    { id: '2', startYear: '2017', endYear: '2019', jobTitle: 'Junior UX Designer', company: 'Company Name', description: 'Lorem ipsum is simply dummy text of the printing and typesetting industry.' },
    { id: '3', startYear: '2015', endYear: '2017', jobTitle: 'UX Designer', company: 'Company Name', description: 'Lorem ipsum is simply dummy text of the printing and typesetting industry.' },
  ],
  skills: ['UI/UX Design', 'Figma', 'Adobe XD', 'Prototyping', 'User Research'],
  hobbies: ['Photography', 'Travel', 'Reading'],
  websites: [],
};
