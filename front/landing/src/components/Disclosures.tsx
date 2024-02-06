
import { Disclosure } from "@headlessui/react";


const BakedDiscloser = ({ buttonText, panelText }: { buttonText: string, panelText: string }) => (
    <Disclosure>
        <Disclosure.Button>
            {buttonText}
        </Disclosure.Button>
        <Disclosure.Panel>
            {panelText}
        </Disclosure.Panel>
    </Disclosure>
)

const Disclosures = () => {
    return (
        <div id='disclosures'>
            <BakedDiscloser
                buttonText='Is my data safe?'
                panelText='Yes, we use the latest encryption technology to keep your data safe.'
            />
        </div>
    )
}

export default Disclosures
