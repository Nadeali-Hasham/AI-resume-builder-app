import type { Schema, Struct } from '@strapi/strapi';

export interface CertificationsCertification extends Struct.ComponentSchema {
  collectionName: 'components_certifications_certifications';
  info: {
    displayName: 'certification';
    icon: 'trophy';
  };
  attributes: {
    credentialUrl: Schema.Attribute.String;
    date: Schema.Attribute.String;
    imageUrl: Schema.Attribute.Text;
    issuer: Schema.Attribute.String;
    name: Schema.Attribute.String;
  };
}

export interface EducationEducation extends Struct.ComponentSchema {
  collectionName: 'components_education_educations';
  info: {
    displayName: 'Education';
    icon: 'file';
  };
  attributes: {
    degree: Schema.Attribute.String;
    description: Schema.Attribute.String;
    endDate: Schema.Attribute.String;
    major: Schema.Attribute.String;
    startDate: Schema.Attribute.String;
    universityName: Schema.Attribute.String;
  };
}

export interface ExperienceExperience extends Struct.ComponentSchema {
  collectionName: 'components_experience_experiences';
  info: {
    displayName: 'Experience';
    icon: 'book';
  };
  attributes: {
    city: Schema.Attribute.String;
    companyName: Schema.Attribute.String;
    endDate: Schema.Attribute.String;
    startDate: Schema.Attribute.String;
    state: Schema.Attribute.String;
    title: Schema.Attribute.String;
    workSummary: Schema.Attribute.String;
  };
}

export interface LanguagesLanguage extends Struct.ComponentSchema {
  collectionName: 'components_languages_languages';
  info: {
    displayName: 'language';
    icon: 'globe';
  };
  attributes: {
    name: Schema.Attribute.String;
    proficiency: Schema.Attribute.String;
  };
}

export interface ProjectsProject extends Struct.ComponentSchema {
  collectionName: 'components_projects_projects';
  info: {
    displayName: 'project';
    icon: 'briefcase';
  };
  attributes: {
    description: Schema.Attribute.Text;
    githubUrl: Schema.Attribute.String;
    link: Schema.Attribute.String;
    name: Schema.Attribute.String;
    technologies: Schema.Attribute.String;
  };
}

export interface SkillsSkills extends Struct.ComponentSchema {
  collectionName: 'components_skills_skills';
  info: {
    displayName: 'Skills';
    icon: 'apps';
  };
  attributes: {
    name: Schema.Attribute.String;
    rating: Schema.Attribute.Integer;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'certifications.certification': CertificationsCertification;
      'education.education': EducationEducation;
      'experience.experience': ExperienceExperience;
      'languages.language': LanguagesLanguage;
      'projects.project': ProjectsProject;
      'skills.skills': SkillsSkills;
    }
  }
}
