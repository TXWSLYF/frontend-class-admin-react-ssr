import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next';
import { WECHAT_LOGIN_URL } from '../../api/wechat';
import fetchServer from '../../util/fetchServer';

const GoodDetail = (props: { userInfo: { nickname: string } }) => {
    const { userInfo } = props;
    const router = useRouter();
    const { id, adChannel } = router.query;

    return (
        <p>
            {id}
            {adChannel}
            {userInfo.nickname}
        </p>
    );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const {
        req: { headers, url },
    } = ctx;
    const href = `https://` + headers.host + url;
    try {
        const userInfo = await fetchServer.get('/h5/user', {
            headers,
        });
        return { props: { userInfo } };
    } catch (error) {
        ctx.res.statusCode = 302;
        ctx.res.setHeader('location', `${WECHAT_LOGIN_URL}?redirect_url=${encodeURIComponent(href)}`);
        ctx.res.end();
        return;
    }
}

export default GoodDetail;
