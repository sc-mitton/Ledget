import { Disclosure } from '@headlessui/react'
import { ChevronDown } from '@geist-ui/icons'
import '../styles/faqs.scss'

const faqs = [
    {
        question: 'Is my data safe?',
        answer: 'We use industry standard encryption to keep your data safe and secure.'
    },
    {
        question: 'Does Ledget store my bank credentials?',
        answer: 'No, we never store your bank credentials. We use Plaid to connect to your bank.'
    },
    {
        question: "What if I'm not satisfied with Ledget?",
        answer: "If you're not satisfied with our product within the first 30 days, we'll give you a full refund. No questions asked."
    }
]

const Faqs = () => {

    return (
        <div id='faqs' className='section'>
            <h1>FAQ</h1>
            <div>
                {faqs.map((faq, index) => (
                    <Disclosure className='faq' key={index} as="div">
                        <Disclosure.Button >
                            <span>{faq.question}</span>
                            <ChevronDown size={'1.25em'} />
                        </Disclosure.Button>
                        <Disclosure.Panel>
                            {faq.answer}
                        </Disclosure.Panel>
                    </Disclosure>))}
            </div>
        </div>
    )
}


export default Faqs
