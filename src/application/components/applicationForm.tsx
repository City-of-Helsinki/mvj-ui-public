import { Tab, TabList, TabPanel, Tabs } from 'hds-react';
import { connect } from 'react-redux';
import { t } from 'i18next';

import {
  ApplicationFormTopLevelSectionFlavor,
  ApplicationSectionKeys,
  APPLICANT_SECTION_IDENTIFIER,
  CONFIRMATION_SECTION_IDENTIFIER,
  TARGET_SECTION_IDENTIFIER,
  APPLICATION_FORM_NAME,
} from '../types';
import { Form } from '../../plotSearch/types';
import ApplicationFormSubsection from './applicationFormSubsection';
import { getCurrentApplicantCount } from '../selectors';
import { RootState } from '../../root/rootReducer';
import { getFavouriteCount } from '../../favourites/selectors';

interface Props {
  baseForm: Form;
  applicantCount: number;
  favouritesCount: number;
  isSaveClicked?: boolean;
}

const ApplicationForm = ({
  baseForm,
  applicantCount,
  favouritesCount,
  isSaveClicked,
}: Props): JSX.Element => {
  const applicantSection = baseForm.sections.find(
    (section) => section.identifier === APPLICANT_SECTION_IDENTIFIER,
  );
  const targetSection = baseForm.sections.find(
    (section) => section.identifier === TARGET_SECTION_IDENTIFIER,
  );
  const confirmationSection = baseForm.sections.find(
    (section) => section.identifier === CONFIRMATION_SECTION_IDENTIFIER,
  );
  const extraSections = baseForm.sections.filter(
    (section) =>
      ![
        APPLICANT_SECTION_IDENTIFIER,
        TARGET_SECTION_IDENTIFIER,
        CONFIRMATION_SECTION_IDENTIFIER,
      ].includes(section.identifier),
  );

  return (
    <form className="ApplicationForm">
      <Tabs>
        <TabList className="ApplicationForm__main-tabs">
          <Tab>
            {t('application.form.tabs.applicants', 'Applicants ({{count}})', {
              count: applicantCount,
            })}
          </Tab>
          <Tab>
            <span id="ApplicationForm-TargetsTabAnchor">
              {t('application.form.tabs.targets', 'Targets ({{count}})', {
                count: favouritesCount,
              })}
            </span>
          </Tab>
          {extraSections.length > 0 && (
            <Tab>{t('application.form.tabs.other', 'Details')}</Tab>
          )}
        </TabList>
        <TabPanel>
          {applicantSection && (
            <ApplicationFormSubsection
              formName={APPLICATION_FORM_NAME}
              path={[ApplicationSectionKeys.Subsections]}
              section={applicantSection}
              headerTag="h2"
              flavor={ApplicationFormTopLevelSectionFlavor.APPLICANT}
              isSaveClicked={isSaveClicked}
            />
          )}
        </TabPanel>
        <TabPanel>
          {targetSection && (
            <ApplicationFormSubsection
              formName={APPLICATION_FORM_NAME}
              path={[ApplicationSectionKeys.Subsections]}
              section={targetSection}
              headerTag="h2"
              flavor={ApplicationFormTopLevelSectionFlavor.TARGET}
              isSaveClicked={isSaveClicked}
            />
          )}
        </TabPanel>
        {extraSections.length > 0 && (
          <TabPanel>
            {extraSections.map((section) => (
              <ApplicationFormSubsection
                formName={APPLICATION_FORM_NAME}
                path={[ApplicationSectionKeys.Subsections]}
                section={section}
                headerTag="h2"
                key={section.id}
                isSaveClicked={isSaveClicked}
              />
            ))}
          </TabPanel>
        )}
      </Tabs>
      {confirmationSection && (
        <ApplicationFormSubsection
          formName={APPLICATION_FORM_NAME}
          path={[ApplicationSectionKeys.Subsections]}
          section={confirmationSection}
          headerTag="h2"
          flavor={ApplicationFormTopLevelSectionFlavor.CONFIRMATION}
          isSaveClicked={isSaveClicked}
        />
      )}
    </form>
  );
};

export default connect((state: RootState) => ({
  applicantCount: getCurrentApplicantCount(state, APPLICATION_FORM_NAME),
  favouritesCount: getFavouriteCount(state),
}))(ApplicationForm);
