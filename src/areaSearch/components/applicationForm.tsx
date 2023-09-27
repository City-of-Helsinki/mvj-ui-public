import ApplicationFormSubsection from '../../application/components/applicationFormSubsection';
import {
  APPLICANT_SECTION_IDENTIFIER,
  CONFIRMATION_SECTION_IDENTIFIER,
  ApplicationFormTopLevelSectionFlavor,
  ApplicationSectionKeys,
} from '../../application/types';
import { Form } from '../../plotSearch/types';

interface Props {
  baseForm: Form;
  formName: string;
}

const ApplicationForm = ({ baseForm, formName }: Props): JSX.Element => {
  const applicantSection = baseForm.sections.find(
    (section) => section.identifier === APPLICANT_SECTION_IDENTIFIER,
  );

  const confirmationSection = baseForm.sections.find(
    (section) => section.identifier === CONFIRMATION_SECTION_IDENTIFIER,
  );

  const extraSections = baseForm.sections.filter(
    (section) =>
      ![APPLICANT_SECTION_IDENTIFIER, CONFIRMATION_SECTION_IDENTIFIER].includes(
        section.identifier,
      ),
  );

  return (
    <form className="AreaSearchApplicationForm">
      {applicantSection && (
        <div className="AreaSearchApplicationForm__section">
          <ApplicationFormSubsection
            key={applicantSection.identifier}
            formName={formName}
            path={['form', ApplicationSectionKeys.Subsections]}
            section={applicantSection}
            headerTag="h2"
            flavor={ApplicationFormTopLevelSectionFlavor.APPLICANT}
          />
        </div>
      )}
      {extraSections.length > 0 && (
        <div className="AreaSearchApplicationForm__section">
          {extraSections.map((section) => (
            <ApplicationFormSubsection
              formName={formName}
              path={['form', ApplicationSectionKeys.Subsections]}
              section={section}
              headerTag="h2"
              key={section.identifier}
            />
          ))}
        </div>
      )}
      {confirmationSection && (
        <ApplicationFormSubsection
          key={confirmationSection.identifier}
          formName={formName}
          path={['form', ApplicationSectionKeys.Subsections]}
          section={confirmationSection}
          headerTag="h2"
          flavor={ApplicationFormTopLevelSectionFlavor.CONFIRMATION}
        />
      )}
    </form>
  );
};

export default ApplicationForm;
