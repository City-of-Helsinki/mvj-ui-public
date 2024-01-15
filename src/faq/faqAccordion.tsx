import { useEffect } from 'react';
import { Accordion, Notification } from 'hds-react';
import { connect } from 'react-redux';
import { RootState } from '../root/rootReducer';
import { Faq } from './types';
import { fetchFaqs } from './actions';
import BlockLoader from '../loader/blockLoader';
import { useTranslation } from 'react-i18next';

interface State {
  isFetchingFaqs: boolean;
  faqs: Faq[];
  faqsNotFound: boolean;
  fetchingFailed: boolean;
}

interface Props {
  isFetchingFaqs: boolean;
  faqs: Faq[];
  fetchFaqs: () => void;
  faqsNotFound: boolean;
  fetchingFailed: boolean;
}

const FaqAccordion = ({
  isFetchingFaqs,
  faqs,
  fetchFaqs,
  faqsNotFound,
  fetchingFailed,
}: Props): JSX.Element => {
  useEffect(() => {
    fetchFaqs();
  }, []);

  const { t } = useTranslation();

  return (
    <>
      {isFetchingFaqs ? (
        <BlockLoader />
      ) : (
        <>
          {faqsNotFound ? null : (
            <Accordion
              className="FaqAccordion"
              heading={t('faq.accordion.heading', 'Frequently asked questions')}
              initiallyOpen
            >
              {fetchingFailed ? (
                <Notification type="error">
                  {t(
                    'faq.notification.error',
                    'Something went wrong while fetching frequently asked questions.',
                  )}
                </Notification>
              ) : (
                <>
                  {faqs.map((faq) => (
                    <div className="FaqAccordion__faq-item" key={faq.question}>
                      <p className="FaqAccordion__question">{faq.question}</p>
                      <p className="FaqAccordion__answer">{faq.answer}</p>
                    </div>
                  ))}
                </>
              )}
            </Accordion>
          )}
        </>
      )}
    </>
  );
};

const mapStateToProps = (state: RootState): State => ({
  faqs: state.faq.faqs,
  isFetchingFaqs: state.faq.isFetchingFaqs,
  fetchingFailed: state.faq.fethingFailed,
  faqsNotFound: state.faq.faqsNotFound,
});

export default connect(mapStateToProps, {
  fetchFaqs,
})(FaqAccordion);
