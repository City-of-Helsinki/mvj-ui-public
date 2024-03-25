import React from 'react';
import { FormSection } from '../../plotSearch/types';
import ApplicationPreviewSubsectionField from './applicationPreviewSubsectionField';
import { getSectionFavouriteTarget, hideOptionalFields } from '../helpers';
import {
  ApplicantTypes,
  ApplicationField,
  ApplicationFormNode,
  ApplicationSectionKeys,
  SHOW_IF_FIELD_IDENTIFIER,
  TARGET_SECTION_IDENTIFIER,
  UploadedFileMeta,
} from '../types';

interface Props {
  answers: ApplicationFormNode | ApplicationFormNode[] | null;
  section: FormSection;
  headerTag?: React.ElementType;
  parentApplicantType?: ApplicantTypes;
  pendingUploads: UploadedFileMeta[];
}

const ApplicationPreviewSubsection = ({
  answers,
  section,
  headerTag: HeaderTag = 'h3',
  parentApplicantType,
  pendingUploads,
}: Props): JSX.Element | null => {
  const isArray = section.add_new_allowed;

  if (!section.visible) {
    return null;
  }

  if (parentApplicantType === ApplicantTypes.UNSELECTED) {
    return null;
  }

  if (
    parentApplicantType !== ApplicantTypes.NOT_APPLICABLE &&
    !(
      [
        ApplicantTypes.UNKNOWN,
        ApplicantTypes.BOTH,
        parentApplicantType,
      ] as Array<ApplicantTypes | null>
    ).includes(section.applicant_type)
  ) {
    return null;
  }

  const getTargetTitle = (id?: number): string => {
    if (id) {
      const target = getSectionFavouriteTarget(id);
      return `${target?.plot_search_target.lease_identifier || '?'} - ${
        target?.plot_search_target.lease_address?.address || '?'
      }, ${target?.plot_search_target.district?.name || '?'}`;
    } else {
      return '?';
    }
  };

  const getParentApplicantType = (
    answer: ApplicationFormNode,
  ): ApplicantTypes => {
    if (answer?.metadata) {
      return answer.metadata['applicantType'] as ApplicantTypes;
    }

    if (parentApplicantType) {
      return parentApplicantType;
    }

    return ApplicantTypes.BOTH;
  };

  let optionalFieldsCheckbox: ApplicationField | undefined;
  let optionalFieldsHidden: boolean = false;
  const answerFields = (answers as ApplicationFormNode).fields;

  if (answerFields) {
    optionalFieldsHidden = hideOptionalFields(answerFields);
    optionalFieldsCheckbox = answerFields[SHOW_IF_FIELD_IDENTIFIER];
  }

  return optionalFieldsCheckbox && optionalFieldsHidden ? null : (
    <div className="ApplicationPreviewSubsection">
      {isArray ? (
        <>
          {(answers as Array<ApplicationFormNode>).map((answer, i) => (
            <div key={`answers-${i}`}>
              {HeaderTag === 'h3' && (
                <hr className="ApplicationPreviewSubsection__hr" />
              )}
              <HeaderTag>
                {section.identifier === TARGET_SECTION_IDENTIFIER ? (
                  <>
                    {section.title} (
                    {getTargetTitle(
                      answer.metadata?.identifier as number | undefined,
                    )}
                    )
                  </>
                ) : (
                  <>
                    {section.title} {i + 1}
                  </>
                )}
              </HeaderTag>
              <div>
                {section.fields.map((field, i) => (
                  <ApplicationPreviewSubsectionField
                    key={`subfield-${i}-${field.identifier}`}
                    field={field}
                    sectionAnswers={answer[ApplicationSectionKeys.Fields]}
                    pendingUploads={pendingUploads}
                  />
                ))}
                {section.subsections.map((subsection, i) => (
                  <React.Fragment
                    key={`subsection-${i}-${subsection.identifier}`}
                  >
                    <ApplicationPreviewSubsection
                      section={subsection}
                      answers={
                        answer[ApplicationSectionKeys.Subsections][
                          subsection.identifier
                        ]
                      }
                      parentApplicantType={getParentApplicantType(answer)}
                      pendingUploads={pendingUploads}
                    />
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </>
      ) : (
        <>
          <hr className="ApplicationPreviewSubsection__hr" />
          <HeaderTag>{section.title}</HeaderTag>
          <div>
            {section.fields.map((field, i) => (
              <ApplicationPreviewSubsectionField
                key={`subfield-${i}-${field.identifier}`}
                field={field}
                sectionAnswers={
                  (answers as ApplicationFormNode)[
                    ApplicationSectionKeys.Fields
                  ]
                }
                pendingUploads={pendingUploads}
              />
            ))}
            {section.subsections.map((subsection, i) => (
              <React.Fragment key={`subsection-${i}-${subsection.identifier}`}>
                <ApplicationPreviewSubsection
                  section={subsection}
                  answers={
                    (answers as ApplicationFormNode)[
                      ApplicationSectionKeys.Subsections
                    ][subsection.identifier]
                  }
                  parentApplicantType={getParentApplicantType(
                    answers as ApplicationFormNode,
                  )}
                  pendingUploads={pendingUploads}
                />
              </React.Fragment>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ApplicationPreviewSubsection;
