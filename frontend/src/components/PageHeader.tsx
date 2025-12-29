import '../css/components/pageHeader.css'

type PageHeaderProps = {
    pageName: string;
};

function PageHeader({ pageName }: PageHeaderProps){

    return(
        <>
            <div id="pageHeader">
                <h1>{pageName}</h1>
            </div>
        </>
    )
}

export default PageHeader;