import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Field,
  FormErrors,
  formValueSelector,
  getFormSyncErrors,
  InjectedFormProps,
  setSubmitSucceeded,
  startSubmit,
  touch,
} from 'redux-form';
import { Col, Container, Row } from 'react-grid-system';
import { Button, Link, Notification } from 'hds-react';
import { connect } from 'react-redux';

import AuthDependentContent from '../auth/components/authDependentContent';
import BlockLoader from '../loader/blockLoader';
import MainContentElement from '../a11y/MainContentElement';
import { openLoginModal } from '../login/actions';
import TextAreaFormField from '../form/TextAreaFormField';
import DateInputFormField from '../form/DateInputFormField';
import SelectFormField from '../form/SelectFormField';
import {
  FileUploadsProvider,
  useFileUploads,
} from '../form/FileUploadsContext';
import FileInputFormField from '../form/FileInputFormField';
import {
  dateAfterValidatorGenerator,
  dateBeforeValidatorGenerator,
  requiredValidatorGenerator,
} from '../form/validators';
import { RootState } from '../root/rootReducer';
import { AREA_SEARCH_FORM_NAME, IntendedSubUse, IntendedUse } from './types';
import { fetchIntendedUses, submitAreaSearch } from './actions';
import { prepareAreaSearchSubmission } from './helpers';
import { getFieldNamesFromFormErrors, ReduxFormError } from '../form/helpers';

interface State {
  startDate?: string;
  endDate?: string;
  intendedUses: Array<IntendedUse> | null;
  selectedIntendedUseCategory?: number;
  lastSubmissionId: number;
  errors: FormErrors;
}

interface OwnProps {
  openLoginModal: () => void;
  submitAreaSearch: typeof submitAreaSearch;
  fetchIntendedUses: typeof fetchIntendedUses;
  startSubmit: typeof startSubmit;
  setSubmitSucceeded: typeof setSubmitSucceeded;
  isSubmittingAreaSearch: boolean;
}

type Props = OwnProps & State & Partial<InjectedFormProps>;

const AreaSearchSpecsPage = ({
  openLoginModal,
  submitAreaSearch,
  isSubmittingAreaSearch,
  touch,
  valid,
  errors,
  startDate,
  endDate,
  startSubmit,
  setSubmitSucceeded,
  fetchIntendedUses,
  intendedUses,
  selectedIntendedUseCategory,
  lastSubmissionId,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  const [initialSubmissionId] = useState<number>(lastSubmissionId);
  const [hasSubmitErrors, setHasSubmitErrors] = useState<boolean>(false);

  const dateNow = useMemo<Date>(() => new Date(), []);

  // define and memoize validators locally (to prevent redefinition/rerender loops)
  const simpleRequiredValidator = useMemo<
    ReturnType<typeof requiredValidatorGenerator>
  >(() => requiredValidatorGenerator(), []);
  const dateAfterPageLoadValidator = useMemo<
    ReturnType<typeof dateAfterValidatorGenerator>
  >(() => dateAfterValidatorGenerator(dateNow.toISOString()), []);
  const isBeforeEndDateValidator = useMemo<
    ReturnType<typeof dateBeforeValidatorGenerator>
  >(
    () =>
      dateBeforeValidatorGenerator(
        endDate,
        t(
          'areaSearch.specs.errors.startDateBeforeEndDate',
          'Start date cannot be after end date.'
        )
      ),
    [startDate, endDate]
  );
  const isAfterStartDateValidator = useMemo<
    ReturnType<typeof dateAfterValidatorGenerator>
  >(
    () =>
      dateAfterValidatorGenerator(
        startDate,
        t(
          'areaSearch.specs.errors.endDateAfterStartDate',
          'End date cannot be before start date.'
        )
      ),
    [startDate, endDate]
  );

  useEffect(() => {
    if (lastSubmissionId > initialSubmissionId) {
      setSubmitSucceeded(AREA_SEARCH_FORM_NAME);
      // TODO: go to application page
    }
  }, [lastSubmissionId]);

  return (
    <FileUploadsProvider>
      <AuthDependentContent>
        {(loading, loggedIn) => {
          useEffect(() => {
            fetchIntendedUses();
          }, []);

          const { files } = useFileUploads();

          const intendedSubUses = useMemo<Array<IntendedSubUse>>(() => {
            if (selectedIntendedUseCategory) {
              const intendedUseCategory = intendedUses?.find(
                (use) => use.id === selectedIntendedUseCategory
              );

              if (intendedUseCategory) {
                return [...intendedUseCategory.subuses];
              }
            }

            return [];
          }, [intendedUses, selectedIntendedUseCategory]);

          if (loading || !intendedUses) {
            return <BlockLoader />;
          }

          const onSubmit = (e: FormEvent): void => {
            e.preventDefault();

            if (valid) {
              startSubmit(AREA_SEARCH_FORM_NAME);
              setHasSubmitErrors(false);
              submitAreaSearch(prepareAreaSearchSubmission(files));
            } else {
              if (touch) {
                touch(
                  AREA_SEARCH_FORM_NAME,
                  ...getFieldNamesFromFormErrors(errors as ReduxFormError)
                );
                setHasSubmitErrors(true);
              }
            }
          };

          return (
            <MainContentElement className="AreaSearchSpecsPage">
              <Container>
                <form onSubmit={onSubmit}>
                  <h1>
                    {t(
                      'areaSearch.specs.heading',
                      'Apply for a land area lease'
                    )}
                  </h1>

                  {loggedIn ? (
                    <>
                      <p>
                        {t(
                          'areaSearch.specs.explanation',
                          "If you're planning to lease an area for example for lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, continue by filling the following form. Tell us a few details about the area you'd like to lease and then fill the application. We'll respond to you as soon as possible. Fields marked with an asterisk (*) are required."
                        )}
                      </p>

                      <section>
                        <h2>
                          {t(
                            'areaSearch.specs.intendedUse.heading',
                            'Specify the intended use and desired time period for the lease'
                          )}
                        </h2>

                        <Row>
                          <Col xs={12} lg={6} xl={4}>
                            <Field
                              name="search.intended_use_category"
                              component={SelectFormField}
                              required
                              options={intendedUses.map((intendedUse) => ({
                                label: intendedUse.name,
                                value: intendedUse.id,
                              }))}
                              label={t(
                                'areaSearch.specs.intendedUse.mainType',
                                'Broad type of intended use'
                              )}
                              validate={[simpleRequiredValidator]}
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col xs={12} lg={6} xl={4}>
                            <Field
                              name="search.intended_use"
                              component={SelectFormField}
                              required
                              options={intendedSubUses.map((intendedUse) => ({
                                label: intendedUse.name,
                                value: intendedUse.id,
                              }))}
                              label={t(
                                'areaSearch.specs.intendedUse.subType',
                                'Specific type of intended use'
                              )}
                              validate={[simpleRequiredValidator]}
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col xs={12} xl={8}>
                            <Field
                              id="description_intended_use"
                              name="search.description_intended_use"
                              component={TextAreaFormField}
                              required
                              label={t(
                                'areaSearch.specs.intendedUse.projectDescription',
                                'Detailed description of intended use'
                              )}
                              validate={[simpleRequiredValidator]}
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col xs={12} lg={6} xl={4}>
                            <Field
                              id="start_date"
                              name="search.start_date"
                              component={DateInputFormField}
                              required
                              label={t(
                                'areaSearch.specs.intendedUse.startDate',
                                'Start date for lease'
                              )}
                              minDate={dateNow}
                              validate={[
                                simpleRequiredValidator,
                                dateAfterPageLoadValidator,
                                isBeforeEndDateValidator,
                              ]}
                            />
                          </Col>
                          <Col xs={12} lg={6} xl={4}>
                            <Field
                              id="end_date"
                              name="search.end_date"
                              component={DateInputFormField}
                              label={t(
                                'areaSearch.specs.intendedUse.endDate',
                                'End date for lease'
                              )}
                              helperText={t(
                                'areaSearch.specs.intendedUse.endDateHelpText',
                                "If you don't yet know the date you'd like the lease to end on or if you'd like to apply for a lease for an indefinite time, please expand on this in the detailed description field above."
                              )}
                              minDate={dateNow}
                              validate={[
                                dateAfterPageLoadValidator,
                                isAfterStartDateValidator,
                              ]}
                            />
                          </Col>
                        </Row>
                      </section>
                      <section>
                        <h2>
                          {t(
                            'areaSearch.specs.area.heading',
                            "Tell us which area you'd like to lease"
                          )}
                        </h2>
                        <p>
                          {t(
                            'areaSearch.specs.area.explanation',
                            'Besides Helsinki itself, the City of Helsinki also owns land in other cities including Sipoo, Espoo, .... The selected area will only serve as the starting point during negotiations.'
                          )}
                        </p>
                        <Link
                          href={t(
                            'areaSearch.specs.area.readMorelinkTarget',
                            'https://hel.fi/'
                          )}
                          external
                          openInNewTab
                        >
                          {t(
                            'areaSearch.specs.area.readMoreLink',
                            'Read more on the City of Helsinki website'
                          )}
                        </Link>
                        <h3>
                          {t(
                            'areaSearch.specs.area.drawOnMap.heading',
                            'Draw the desired area on the map'
                          )}
                        </h3>
                        <p>
                          {t(
                            'areaSearch.specs.area.drawOnMap.explanation',
                            "Note that the area you specify will be precursory only. We'll contact you to determine the exact area later during the application handling process. Areas colored in dark gray are not owned by the City of Helsinki."
                          )}
                        </p>
                        {/* todo */}
                        (karttakomponentti)
                        <Row>
                          <Col xs={12} xl={8}>
                            <Field
                              id="description_area"
                              name="search.description_area"
                              component={TextAreaFormField}
                              required
                              label={t(
                                'areaSearch.specs.area.areaDescription',
                                'Detailed description of desired area'
                              )}
                              validate={[simpleRequiredValidator]}
                            />
                          </Col>
                        </Row>
                      </section>
                      <section>
                        <h2>
                          {t(
                            'areaSearch.specs.attachments.heading',
                            'Attachments'
                          )}
                        </h2>

                        <Field
                          id="attachments"
                          name="search.attachments"
                          component={FileInputFormField}
                          label={t(
                            'areaSearch.specs.attachments.input',
                            'You may also optionally include any relevant attachments here, such as photos of the area in question, lorem ipsum, dolor tai sit amet.'
                          )}
                          dragAndDrop
                          multiple
                          maxSize={20 * 1024 * 1024}
                        />
                      </section>
                      <Button
                        variant="primary"
                        onClick={onSubmit}
                        isLoading={isSubmittingAreaSearch}
                        loadingText={t(
                          'areaSearch.specs.submitting',
                          'Submitting...'
                        )}
                        disabled={hasSubmitErrors && !valid}
                      >
                        {t(
                          'areaSearch.specs.continueButton',
                          'Apply for this area'
                        )}
                      </Button>
                      {hasSubmitErrors && !valid && (
                        <Notification
                          className="AreaSearchSpecsPage__submit-error"
                          type="error"
                        >
                          {t(
                            'areaSearch.specs.checkErrors',
                            'Please check the marked fields before proceeding.'
                          )}
                        </Notification>
                      )}
                    </>
                  ) : (
                    <>
                      <p>
                        {t(
                          'areaSearch.specs.notLoggedIn',
                          'To apply, please log in first.'
                        )}
                      </p>
                      <Button
                        variant="primary"
                        onClick={() => openLoginModal()}
                      >
                        {t('areaSearch.specs.loginButton', 'Log in')}
                      </Button>
                    </>
                  )}
                </form>
              </Container>
            </MainContentElement>
          );
        }}
      </AuthDependentContent>
    </FileUploadsProvider>
  );
};

const selector = formValueSelector(AREA_SEARCH_FORM_NAME);

export default connect(
  (state: RootState) => ({
    startDate: selector(state, 'search.start_date'),
    endDate: selector(state, 'search.end_date'),
    selectedIntendedUseCategory: selector(
      state,
      'search.intended_use_category'
    ),
    intendedUses: state.areaSearch.intendedUses,
    isSubmittingAreaSearch: state.areaSearch.isSubmittingAreaSearch,
    lastSubmissionId: state.areaSearch.lastSubmissionId,
    errors: getFormSyncErrors(AREA_SEARCH_FORM_NAME)(state),
  }),
  {
    openLoginModal,
    submitAreaSearch,
    startSubmit,
    setSubmitSucceeded,
    touch,
    fetchIntendedUses,
  }
)(AreaSearchSpecsPage);
