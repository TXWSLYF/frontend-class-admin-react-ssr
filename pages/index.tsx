import { menuList } from '../common/constant';

menuList;

export default function Index() {
    return <div></div>;
}

export async function getServerSideProps(context) {
    context.res.statusCode = 302;
    context.res.setHeader('location', menuList[0].children[0].path);
    return {
        props: {},
    };
}
