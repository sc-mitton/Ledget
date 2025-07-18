import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronDown } from '@geist-ui/icons';
import '../styles/faqs.scss';

const faqs = [
  {
    question: 'Is my data safe?',
    answer:
      'We use industry standard encryption to keep your data safe and secure.',
  },
  {
    question: 'Does Ledget store my bank credentials?',
    answer:
      'No, we never store your bank credentials. We use Plaid to connect to your bank.',
  },
  {
    question: "What if I'm not satisfied with Ledget?",
    answer:
      "If you're not satisfied with our product within the first 30 days, we'll give you a full refund. No questions asked.",
  },
];

const Faqs = () => {
  return (
    <div id="faqs" className="section">
      <h2>FAQ</h2>
      <div>
        {faqs.map((faq, index) => (
          <div className="faq" key={index}>
            <Disclosure>
              {({ open }) => (
                <>
                  <DisclosureButton>
                    <span>{faq.question}</span>
                    <ChevronDown
                      size={'1.25em'}
                      strokeWidth={2}
                      className={`${open ? 'rotate-180' : ''}`}
                    />
                  </DisclosureButton>
                  <DisclosurePanel>{faq.answer}</DisclosurePanel>
                </>
              )}
            </Disclosure>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faqs;
