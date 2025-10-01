const defaultTitle = "Welcome to CV Asker";
const defaultDescription = "Practice smarter, answer better.";
const defaultKeywords = "study, question bank, practice interview, gen-ai powered";


const Meta = ({ title = defaultTitle, description = defaultDescription, keywords = defaultKeywords }) => {
    return (
        <>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
        </>
    );
};

export default Meta;