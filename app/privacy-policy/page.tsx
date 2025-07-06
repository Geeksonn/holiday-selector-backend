export default function PrivacyPolicyScreen() {
    const articles: { title: string; description: string }[] = [
        {
            title: '1. Introduction',
            description: `This policy explains how your private data are processed.\nWhen you use this application, you agree with our privacy policy.\nIn order to function properly, Holiday Selector needs to collect some personal data.`,
        },
        {
            title: '2. Collecting Private Data',
            description: `Via the connection to this application, we save your e-mail and name that either you entered during subscription or that are linked to your social account with which you connected.`,
        },
        {
            title: '3. Usage of your Private Data',
            description: `Your e-mail is used to identify you as a user of this application. This allows us to link your account to the holidays created by you or shared with you by a friend. We will not use your e-mail for marketing e-mails and we will never share it with external application without your consent.`,
        },
        {
            title: '4. Retention Period',
            description: `Because your e-mail is used by the application (to link you with created holidays), we will keep your e-mail and names for as long as you are a user of this application. At any time, you can ask to delete your account, this will remove your account from our database and will remove your e-mail from all the created holidays.`,
        },
        {
            title: '5. Your rights regarding your Private Data',
            description: `At any time, upon explicit demand via our e-mail 'olivier@geekson.be', you can ask to consult the data linked to your e-mail address.`,
        },
        {
            title: '6. Contact',
            description: `The only way to contact us about this privacy policy is to send us an e-mail to 'olivier@geekson.be'`,
        },
    ];

    return (
        <div className='flex flex-col gap-y-4'>
            <div className='flex flex-col gap-y-2'>
                {articles.map((a, i) => (
                    <>
                        <h1 key={`h1_${i}`} className='font-bold'>
                            {a.title}
                        </h1>
                        <p key={`p_${i}`} className='text-sm text-gray-600'>
                            {a.description}
                        </p>
                    </>
                ))}
            </div>
        </div>
    );
}
