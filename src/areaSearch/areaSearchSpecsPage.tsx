import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Field,
  FormErrors,
  formValueSelector,
  getFormSyncErrors,
  setSubmitSucceeded,
  startSubmit,
  touch,
  change,
  FormAction,
} from 'redux-form';
import { Col, Row } from 'react-grid-system';
import { Button, Notification } from 'hds-react';
import { connect } from 'react-redux';

import AuthDependentContent from '../auth/components/authDependentContent';
import BlockLoader from '../loader/blockLoader';
import { openLoginModal } from '../login/actions';
import TextAreaFormField from '../form/TextAreaFormField';
import DateInputFormField from '../form/DateInputFormField';
import SelectFormField from '../form/SelectFormField';
import { useFileUploads } from '../form/FileUploadsContext';
import FileInputFormField, {
  getAllowedFileTypes,
} from '../form/FileInputFormField';
import {
  dateAfterOrEqualValidatorGenerator,
  dateBeforeOrEqualValidatorGenerator,
  eitherMultiPolygonOrRequiredValidatorGenerator,
  nonEmptyMultiPolygonValidatorGenerator,
  requiredValidatorGenerator,
} from '../form/validators';
import { RootState } from '../root/rootReducer';
import { AREA_SEARCH_FORM_NAME, AreaSearch, IntendedUse } from './types';
import {
  fetchIntendedUses,
  initializeAreaSearchAttachments,
  submitAreaSearch,
  submitAreaSearchAttachment,
} from './actions';
import {
  getCurrentDatePlaceholder,
  prepareAreaSearchSubmission,
} from './helpers';
import { getFieldNamesFromFormErrors, ReduxFormError } from '../form/helpers';
import AreaSearchMap from './components/AreaSearchMap';
import { getInitialAreaSearchApplicationForm } from './helpers';
import { ApplicationFormRoot } from '../application/types';
import ScrollToTop from '../common/ScrollToTop';
import type { MultiPolygon } from 'geojson';

interface State {
  startDate?: string;
  endDate?: string;
  geometry?: MultiPolygon | null;
  descriptionArea?: string;
  intendedUses: Array<IntendedUse> | null;
  lastSubmission: AreaSearch | null;
  lastSubmissionId: number;
  errors: FormErrors;
  applicationFormTemplate: ApplicationFormRoot;
}

interface OwnProps {
  openLoginModal: () => void;
  submitAreaSearch: typeof submitAreaSearch;
  initializeAreaSearchAttachments: typeof initializeAreaSearchAttachments;
  submitAreaSearchAttachment: typeof submitAreaSearchAttachment;
  fetchIntendedUses: typeof fetchIntendedUses;
  startSubmit: typeof startSubmit;
  setSubmitSucceeded: typeof setSubmitSucceeded;
  isSubmittingAreaSearch: boolean;
  change: (
    form: string,
    field: string,
    value: any,
    touch?: boolean,
    persistentSubmitErrors?: boolean,
  ) => FormAction;
  valid: boolean;
  touch(...field: string[]): void;
  lastSubmissionError: unknown;
}

type Props = OwnProps & State;

const AreaSearchSpecsPage = ({
  openLoginModal,
  submitAreaSearch,
  isSubmittingAreaSearch,
  initializeAreaSearchAttachments,
  touch,
  valid,
  errors,
  startDate,
  endDate,
  geometry,
  descriptionArea,
  startSubmit,
  setSubmitSucceeded,
  fetchIntendedUses,
  intendedUses,
  lastSubmissionId,
  lastSubmissionError,
  applicationFormTemplate,
  change,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  const prevSubmissionIdRef = useRef<number>(lastSubmissionId);

  const [hasSubmitErrors, setHasSubmitErrors] = useState<boolean>(false);

  const dateNow = useMemo<Date>(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);

    return date;
  }, []);
  const lastDate = useMemo<Date>(() => {
    const now = new Date();
    now.setFullYear(now.getFullYear() + 25);

    return now;
  }, []);
  const startDateObject = useMemo<Date | null>(
    () => (startDate ? new Date(startDate) : null),
    [startDate],
  );

  // define and memoize validators locally (to prevent redefinition/rerender loops)
  const simpleRequiredValidator = useMemo<
    ReturnType<typeof requiredValidatorGenerator>
  >(() => requiredValidatorGenerator(), []);
  const nonEmptyMultiPolygonValidator = useMemo<
    ReturnType<typeof nonEmptyMultiPolygonValidatorGenerator>
  >(() => nonEmptyMultiPolygonValidatorGenerator(), []);
  const dateAfterPageLoadValidator = useMemo<
    ReturnType<typeof dateAfterOrEqualValidatorGenerator>
  >(() => dateAfterOrEqualValidatorGenerator(dateNow.toISOString()), []);
  const isBeforeEndDateValidator = useMemo<
    ReturnType<typeof dateBeforeOrEqualValidatorGenerator>
  >(
    () =>
      dateBeforeOrEqualValidatorGenerator(
        endDate,
        t(
          'areaSearch.specs.errors.startDateBeforeEndDate',
          'Start date cannot be after end date.',
        ),
      ),
    [startDate, endDate],
  );
  const isAfterStartDateValidator = useMemo<
    ReturnType<typeof dateAfterOrEqualValidatorGenerator>
  >(
    () =>
      dateAfterOrEqualValidatorGenerator(
        startDate,
        t(
          'areaSearch.specs.errors.endDateAfterStartDate',
          'End date cannot be before start date.',
        ),
      ),
    [startDate, endDate],
  );
  const polygonOrDescriptionRequired = useMemo<
    ReturnType<typeof eitherMultiPolygonOrRequiredValidatorGenerator>
  >(
    () =>
      eitherMultiPolygonOrRequiredValidatorGenerator(
        geometry,
        t(
          'areaSearch.specs.errors.eitherPolygonOrDescription',
          'Select either polygon or description.',
        ),
      ),
    [geometry, descriptionArea],
  );

  useEffect(() => {
    if (!prevSubmissionIdRef.current) {
      change(AREA_SEARCH_FORM_NAME, 'form', applicationFormTemplate, true);
      initializeAreaSearchAttachments();
    }
  }, []);

  useEffect(() => {
    if (lastSubmissionId > prevSubmissionIdRef.current) {
      prevSubmissionIdRef.current = lastSubmissionId;
      setSubmitSucceeded(AREA_SEARCH_FORM_NAME);
    }
  }, [lastSubmissionId]);

  return (
    <>
      <ScrollToTop />
      <AuthDependentContent>
        {(loading, loggedIn) => {
          useEffect(() => {
            fetchIntendedUses();
          }, []);

          const { files } = useFileUploads();

          if (loading || !intendedUses) {
            return <BlockLoader />;
          }

          const onSubmit = (e: FormEvent): void => {
            e.preventDefault();

            if (valid) {
              startSubmit(AREA_SEARCH_FORM_NAME);
              setHasSubmitErrors(false);
              const submitParams = {
                ...prepareAreaSearchSubmission(files['search.attachments']),
                id: lastSubmissionId && lastSubmissionId,
              };
              submitAreaSearch(submitParams);
            } else {
              if (touch) {
                touch(
                  AREA_SEARCH_FORM_NAME,
                  ...getFieldNamesFromFormErrors(errors as ReduxFormError),
                );
                setHasSubmitErrors(true);
              }
            }
          };

          return (
            <form onSubmit={onSubmit}>
              <h1>
                {t('areaSearch.specs.heading', 'Apply for a land area lease')}
              </h1>

              {loggedIn ? (
                <>
                  <p>
                    {t(
                      'areaSearch.specs.explanation',
                      'If you are willing to lease an area, continue by filling up the application. Please tell us your wishes concerning the area, intended use of the lease and lease time. We will contact you as soon as possible. Fields marked with an asterisk are required.',
                    )}
                  </p>
                  <section>
                    <h2>
                      {t(
                        'areaSearch.specs.intendedUse.heading',
                        'Specify the intended use and desired time period for the lease',
                      )}
                    </h2>

                    <Row className="row">
                      <Col xs={12} lg={6} xl={4}>
                        <Field
                          name="search.intended_use"
                          component={SelectFormField}
                          required
                          options={intendedUses.map((intendedUse) => ({
                            label: intendedUse.name,
                            value: intendedUse.id,
                          }))}
                          label={t(
                            'areaSearch.specs.intendedUse.mainType',
                            'Intended use',
                          )}
                          validate={[simpleRequiredValidator]}
                          placeholder={t(
                            'areaSearch.specs.intendedUse.mainTypePlaceholder',
                            'Intended use',
                          )}
                        />
                      </Col>
                    </Row>
                    <Row className="row">
                      <Col xs={12} xl={8}>
                        <Field
                          id="description_intended_use"
                          name="search.description_intended_use"
                          component={TextAreaFormField}
                          required
                          label={t(
                            'areaSearch.specs.intendedUse.projectDescription',
                            'Detailed description of intended use',
                          )}
                          validate={[simpleRequiredValidator]}
                          helperText={t(
                            'areaSearch.specs.intendedUse.projectDescriptionHelpText',
                            'What kind of activity would you like to carry out on the area? Please describe the project in as much detail as possible.',
                          )}
                        />
                      </Col>
                    </Row>
                    <Row className="row">
                      <Col xs={12} lg={6} xl={4}>
                        <Field
                          id="start_date"
                          name="search.start_date"
                          component={DateInputFormField}
                          required
                          label={t(
                            'areaSearch.specs.intendedUse.startDate',
                            'Start date for lease',
                          )}
                          helperText={t(
                            'areaSearch.specs.intendedUse.startDateHelpText',
                            'Please note that applications will be processed in the order they were submitted.',
                          )}
                          minDate={dateNow}
                          maxDate={lastDate}
                          validate={[
                            simpleRequiredValidator,
                            dateAfterPageLoadValidator,
                            isBeforeEndDateValidator,
                          ]}
                          placeholder={getCurrentDatePlaceholder()}
                        />
                      </Col>
                      <Col xs={12} lg={6} xl={4}>
                        <Field
                          id="end_date"
                          name="search.end_date"
                          component={DateInputFormField}
                          label={t(
                            'areaSearch.specs.intendedUse.endDate',
                            'End date for lease',
                          )}
                          helperText={t(
                            'areaSearch.specs.intendedUse.endDateHelpText',
                            "If you don't yet know the date you'd like the lease to end on or if you'd like to apply for a lease for an indefinite time, please expand on this in the detailed description field above.",
                          )}
                          minDate={startDateObject || dateNow}
                          maxDate={lastDate}
                          validate={[
                            dateAfterPageLoadValidator,
                            isAfterStartDateValidator,
                          ]}
                          initialMonth={startDateObject || dateNow}
                          placeholder={getCurrentDatePlaceholder()}
                        />
                      </Col>
                    </Row>
                  </section>
                  <section>
                    <h2>
                      {t(
                        'areaSearch.specs.area.heading',
                        "Tell us which area you'd like to lease",
                      )}
                    </h2>
                    <h3>
                      {t(
                        'areaSearch.specs.area.drawOnMap.heading',
                        'Draw the desired area on the map',
                      )}
                    </h3>
                    <p>
                      {t(
                        'areaSearch.specs.area.drawOnMap.explanation',
                        "Note that the area you specify will be precursory only. We'll contact you to determine the exact area later during the application handling process. Areas colored in dark gray are not owned by the City of Helsinki.",
                      )}
                    </p>
                    <Row className="row">
                      <Col xs={12}>
                        <Notification
                          label={t(
                            'areaSearch.specs.area.drawOnMap.helpTexts.label',
                            'Map',
                          )}
                        >
                          <ol>
                            <li>
                              {t(
                                'areaSearch.specs.area.drawOnMap.helpTexts.phase1',
                                'Start by searching',
                              )}
                            </li>
                            <li>
                              {t(
                                'areaSearch.specs.area.drawOnMap.helpTexts.phase2',
                                'Draw area',
                              )}
                            </li>
                            <li>
                              {t(
                                'areaSearch.specs.area.drawOnMap.helpTexts.phase3',
                                'Drawing is saved automatically',
                              )}
                            </li>
                            <li>
                              {t(
                                'areaSearch.specs.area.drawOnMap.helpTexts.phase4',
                                'You can edit your drawing',
                              )}
                            </li>
                          </ol>
                          <div className="map-icon-container">
                            <div className="map-icon-container_column">
                              <div className="map-icon-container_row">
                                <img
                                  src="/zoom-in-out.png"
                                  alt={t(
                                    'areaSearch.specs.area.drawOnMap.helpTexts.zoomToolsAlt',
                                    'Zoom in and out',
                                  )}
                                  className="map-icon"
                                />
                                <span>
                                  {t(
                                    'areaSearch.specs.area.drawOnMap.helpTexts.zoomTools',
                                    'Zoom in and out',
                                  )}
                                </span>
                              </div>
                              <div className="map-icon-container_row">
                                <img
                                  src="/draw-tools.png"
                                  alt={t(
                                    'areaSearch.specs.area.drawOnMap.helpTexts.drawToolsAlt',
                                    'Drawing tools',
                                  )}
                                  className="map-icon"
                                />
                                <span>
                                  {t(
                                    'areaSearch.specs.area.drawOnMap.helpTexts.drawTools',
                                    'Drawing tools',
                                  )}
                                </span>
                              </div>
                            </div>
                            <div className="map-icon-container_column">
                              <div className="map-icon-container_row">
                                <img
                                  src="/edit-tools.png"
                                  alt={t(
                                    'areaSearch.specs.area.drawOnMap.helpTexts.editTools',
                                    'Edit and delete',
                                  )}
                                  className="map-icon"
                                />
                                <span>
                                  {t(
                                    'areaSearch.specs.area.drawOnMap.helpTexts.editTools',
                                    'Edit and delete',
                                  )}
                                </span>
                              </div>
                              <div className="map-icon-container_row">
                                <img
                                  src="/map-layers.png"
                                  alt={t(
                                    'areaSearch.specs.area.drawOnMap.helpTexts.mapLayers',
                                    'Map layers',
                                  )}
                                  className="map-icon-squared"
                                />
                                <span>
                                  {t(
                                    'areaSearch.specs.area.drawOnMap.helpTexts.mapLayers',
                                    'Map layers',
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Notification>
                      </Col>
                    </Row>
                    <Row className="row">
                      <Col xs={12}>
                        <Field
                          id="geometry"
                          name="search.geometry"
                          component={AreaSearchMap}
                          validate={[
                            nonEmptyMultiPolygonValidator,
                            polygonOrDescriptionRequired,
                          ]}
                        />
                      </Col>
                    </Row>
                    <Row className="row">
                      <Col xs={12} xl={8}>
                        <Field
                          id="description_area"
                          name="search.description_area"
                          component={TextAreaFormField}
                          label={t(
                            'areaSearch.specs.area.areaDescription',
                            'Detailed description of desired area',
                          )}
                          helperText={t(
                            'areaSearch.specs.area.areaDescriptionHelpText',
                            'Detailed desciption of desired area',
                          )}
                          validate={[polygonOrDescriptionRequired]}
                        />
                      </Col>
                    </Row>
                  </section>
                  <section>
                    <h2>
                      {t('areaSearch.specs.attachments.heading', 'Attachments')}
                    </h2>
                    <Field
                      id="attachments"
                      name="search.attachments"
                      component={FileInputFormField}
                      label={t(
                        'areaSearch.specs.attachments.input',
                        'You may also optionally include any relevant attachments here, such as photos of the area in question.',
                      )}
                      dragAndDrop
                      multiple
                      maxSize={20 * 1024 * 1024} // 20MB
                      accept={getAllowedFileTypes()}
                    />
                  </section>
                  <section className="no-padding">
                    {hasSubmitErrors && !valid && (
                      <Notification
                        className="AreaSearchSpecsPage__submit-error"
                        type="error"
                      >
                        {t(
                          'areaSearch.specs.errors.validation',
                          'Please check the marked fields before proceeding.',
                        )}
                      </Notification>
                    )}
                  </section>
                  <Button
                    variant="primary"
                    onClick={(e) => onSubmit(e)}
                    isLoading={isSubmittingAreaSearch}
                    loadingText={t(
                      'areaSearch.specs.submitting',
                      'Submitting...',
                    )}
                    disabled={hasSubmitErrors && !valid}
                  >
                    {t(
                      'areaSearch.specs.continueButton',
                      'Apply for this area',
                    )}
                  </Button>
                  {lastSubmissionError && (
                    <Notification
                      className="AreaSearchSpecsPage__submit-error"
                      type="error"
                    >
                      {(
                        lastSubmissionError as {
                          failedAttachments: Array<string>;
                        }
                      )?.failedAttachments?.length > 0
                        ? t(
                            'areaSearch.specs.errors.attachment',
                            'One or more attachments failed to upload! Please try again.',
                          )
                        : t(
                            'areaSearch.specs.errors.other',
                            'An unknown error occurred while submitting the area search. Please try again.',
                          )}
                    </Notification>
                  )}
                </>
              ) : (
                <>
                  <p>
                    {t(
                      'areaSearch.specs.notLoggedIn',
                      'To apply, please log in first.',
                    )}
                  </p>
                  <Button variant="primary" onClick={() => openLoginModal()}>
                    {t('areaSearch.specs.loginButton', 'Log in')}
                  </Button>
                </>
              )}
            </form>
          );
        }}
      </AuthDependentContent>
    </>
  );
};

const selector = formValueSelector(AREA_SEARCH_FORM_NAME);

export default connect(
  (state: RootState) => ({
    startDate: selector(state, 'search.start_date'),
    endDate: selector(state, 'search.end_date'),
    geometry: selector(state, 'search.geometry'),
    descriptionArea: selector(state, 'search.description_area'),
    intendedUses: state.areaSearch.intendedUses,
    isSubmittingAreaSearch: state.areaSearch.isSubmittingAreaSearch,
    lastSubmission: state.areaSearch.lastSubmission,
    lastSubmissionId: state.areaSearch.lastSubmissionId,
    lastSubmissionError: state.areaSearch.lastError,
    errors: getFormSyncErrors(AREA_SEARCH_FORM_NAME)(state),
    applicationFormTemplate: getInitialAreaSearchApplicationForm(state),
  }),
  {
    openLoginModal,
    submitAreaSearch,
    startSubmit,
    setSubmitSucceeded,
    touch,
    fetchIntendedUses,
    initializeAreaSearchAttachments,
    submitAreaSearchAttachment,
    change,
  },
)(AreaSearchSpecsPage);
