import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next';
import { WECHAT_LOGIN_URL, wechatUnifiedorder } from '../../api/wechat';
import fetchServer from '../../util/fetchServer';
import css from './index.module.scss';
import { GOOD_INFO_URL, IS_PURCHASED_GOOD_URL, checkIsPurchasedGood } from '../../api/good';
import { USER_COUPON_INFO_URL } from '../../api/coupon';
import AgreementModel from '../../components/AgreementModel';
import React, { useState, useEffect } from 'react';

const GoodDetail = (props: {
    userInfo: IUserInfo;
    goodInfo: IGoodInfo;
    isPurchasedGood: boolean;
    userCouponInfo: null | { couponInfo: ICouponInfo };
}) => {
    const {
        goodInfo: { h5Poster, originPrice, price },
        isPurchasedGood,
        userCouponInfo,
    } = props;
    const router = useRouter();
    const { id, adChannel } = router.query;

    // https://medium.com/@martin_hotell/react-refs-with-typescript-a32d56c4d315
    const footerRef = React.createRef<HTMLDivElement>();
    const mainRef = React.createRef<HTMLDivElement>();

    const [agreementModelVisible, setAgreementModelVisible] = useState(false);
    const [isAgreement, setIsAgreement] = useState(true);

    const totalFee = userCouponInfo ? price - userCouponInfo.couponInfo.denomination : price;

    const setMainHeight = () => {
        const footerHeight = footerRef.current.clientHeight;
        const caclMainHeight = `calc(100vh - ${footerHeight}px)`;
        mainRef.current.style.height = caclMainHeight;
    };

    const gotoCourseGuide = () => {
        window.location.href = '/courseGuide.html';
    };

    const handleSignUp = async () => {
        if (!isAgreement) {
            alert('请先同意报名须知');
            return;
        }

        let orderInfoRes = null;

        try {
            orderInfoRes = await wechatUnifiedorder({ goodId: id, adChannel });
        } catch (error) {
            alert(`支付接口错误`);
            return;
        }

        window.WeixinJSBridge.invoke('getBrandWCPayRequest', orderInfoRes.data.payParams, (res) => {
            if (res.err_msg === 'get_brand_wcpay_request:ok') {
                // 轮询次数
                let intervalCount = 0;
                // 调用后台接口判断是否真正购买成功
                const intervalId = setInterval(async () => {
                    const isPurchasedRes = await checkIsPurchasedGood(id);
                    intervalCount += 1;

                    // 支付成功逻辑
                    if (isPurchasedRes) {
                        clearInterval(intervalId);
                        // 跳转课程引导页面
                        gotoCourseGuide();
                        return;
                    }

                    if (intervalCount > 20) {
                        clearInterval(intervalId);
                        alert('支付失败');
                    }
                }, 2000);
            }
        });
    };

    useEffect(() => {
        setMainHeight();
    }, [isAgreement]);

    return (
        <div className={css['good-detail']}>
            <main ref={mainRef}>
                <img src={h5Poster} />

                <div className={css['faq']}>
                    <div className={css['faq-title']}>常见问题</div>
                    <div className={css['faq-item']}>
                        <div className={css['faq-item--q']}>Q：课程多久可以学完</div>
                        <div className={css['faq-item--a']}>
                            A：课程采用关卡制，可以根据自己的能力和情况来选择学习节奏，且课程内容可以反复阅读。
                        </div>
                    </div>
                    <div className={css['faq-item']}>
                        <div className={css['faq-item--q']}>Q：可以退款吗？</div>
                        <div className={css['faq-item--a']}>
                            A：
                            <span className={css['text-focus']}>可以。</span>
                            支付后7×24小时可申请退款，逾期不可申请。
                            <span>（退款金额根据课堂完成状态按比例计算）</span>
                        </div>
                    </div>
                    <div className={css['faq-item']}>
                        <div className={css['faq-item--q']}>Q：会不会有老师亲自指导呢？</div>
                        <div className={css['faq-item--a']}>
                            A：
                            <span className={css['text-focus']}>有的。</span>我们的课程采用的授课方式是
                            <span className={css['text-focus']}>线上教学+社群服务</span>
                            的方式，在社群服务的期间，社群中会有助教针对你学习过程中遇到的问题一一解答的。
                        </div>
                    </div>
                    <div className={css['faq-item']}>
                        <div className={css['faq-item--q']}>Q：课程学习需要安装什么软件吗？</div>
                        <div className={css['faq-item--a']}>
                            A：
                            <span className={css['text-focus']}>不需要。</span>
                            我们的课程无需安装任何的额外的软件，打开网页就能开始学习。
                        </div>
                    </div>
                </div>

                <div className={css['agreement']}>
                    <input
                        v-if="!isPurchased"
                        id="agreement-checkbox"
                        checked={isAgreement}
                        onChange={(e) => {
                            setIsAgreement(e.target.checked);
                        }}
                        type="checkbox"
                    />
                    <label htmlFor="agreement-checkbox" />
                    已阅读并同意
                    <a
                        onClick={() => {
                            setAgreementModelVisible(true);
                        }}
                    >
                        《前端轻松学报名须知》
                    </a>
                </div>
            </main>

            <footer ref={footerRef}>
                {!isPurchasedGood && (
                    <div className={css['unpurchased-container']}>
                        <div className={css['price-container']}>
                            <div className={css['price-container--preferential']}>
                                <div>
                                    <span className={css['yuan']}>¥</span>
                                    <span>{totalFee / 100}</span>
                                </div>
                            </div>
                            <div className={css['price-container--original']}>
                                <p>限时优惠</p>
                                <p>原价 {originPrice / 100}</p>
                            </div>
                        </div>
                        <div className={css['signup-btn-container']}>
                            <div
                                className={!isAgreement ? css['disabled'] : ''}
                                onClick={() => {
                                    handleSignUp();
                                }}
                            >
                                马上报名
                            </div>
                        </div>
                    </div>
                )}

                {!isAgreement && <div className={css['agreement-tip']}>请阅读并勾选《前端轻松学报名须知》</div>}

                {isPurchasedGood && (
                    <div className={css['purchased-container']} onClick={gotoCourseGuide}>
                        <div>上课指引</div>
                        <div>（已有本课程学习资格）</div>
                    </div>
                )}
            </footer>

            <AgreementModel
                close={() => {
                    setAgreementModelVisible(false);
                }}
                visible={agreementModelVisible}
            ></AgreementModel>

            <style jsx global>
                {`
                    * {
                        box-sizing: border-box;
                    }
                `}
            </style>

            {/* https://github.com/vercel/styled-jsx/issues/615 */}
            <style jsx>
                {`
                    #agreement-checkbox + label {
                        display: block;
                        width: 5vw;
                        height: 5vw;
                        line-height: 5vw;
                        cursor: pointer;
                        border: 1px solid #9c27af;
                        background: white;
                        margin-right: 2vw;
                    }

                    #agreement-checkbox:checked + label {
                        background: #9c27af;
                    }

                    #agreement-checkbox:checked + label::before {
                        content: '${'\\2714'}';
                        display: block;
                        text-align: center;
                        font-size: 3vw;
                        color: white;
                    }

                    input[type='checkbox'] {
                        visibility: hidden;
                    }
                `}
            </style>
        </div>
    );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const {
        req: { headers, url },
        query: { id },
    } = ctx;
    const href = `https://` + headers.host + url;
    try {
        const [userInfo, goodInfo, isPurchasedGood, userCouponInfo] = await Promise.all([
            fetchServer.get('/h5/user', {
                headers,
            }),
            fetchServer.get(`${GOOD_INFO_URL}?id=${id}`, { headers }),
            fetchServer.post(IS_PURCHASED_GOOD_URL, { goodId: id }, { headers }),
            fetchServer.get(`${USER_COUPON_INFO_URL}/${id}`, { headers }),
        ]);
        return { props: { userInfo, goodInfo, isPurchasedGood, userCouponInfo } };
    } catch (error) {
        ctx.res.statusCode = 302;
        ctx.res.setHeader('location', `${WECHAT_LOGIN_URL}?redirect_url=${encodeURIComponent(href)}`);
        ctx.res.end();
        return;
    }
}

export default GoodDetail;
