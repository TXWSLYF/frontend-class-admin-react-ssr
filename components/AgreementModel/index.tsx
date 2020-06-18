import css from './index.module.scss';

export default function AgreementModel({ close, visible }: { close: () => void; visible: boolean }) {
    return (
        <div className={css['agreement-model']} style={{ display: visible ? 'block' : 'none' }}>
            <div
                className={css['agreement-model--mask']}
                onClick={() => {
                    close();
                }}
            ></div>
            <div className={css['agreement-model--content']}>
                <h2>《前端轻松学报名须知》</h2>

                <ul>
                    <li>1.为了保障学员的学习效果和质量，我们采取闯关解锁制度，即学完一关解锁下一关。</li>
                    <li>2.支付成功后，用户可重复阅读相应课程已解锁的内容。</li>
                    <li>
                        <span className={css['text-focus']}>
                            支持支付后7x24小时内申请退款，超过期限不能申请。退款金额根据课堂完成状态按比例计算，退款成功后对应课程学习资格将会被注销
                        </span>
                        。具体见下述退款规则：
                    </li>
                    <li>
                        <span className={css['text-focus']}>
                            1.用户只能在本次支付成功后7x24小时期限内申请退款，超过期限则不能申请退款。
                        </span>
                    </li>
                    <li>
                        <span className={css['text-focus']}>2.退款金额根据课堂完成状态按比例计算。</span>
                        本课程根据课堂完成状态按比例退款： a.
                        用户可获得的退款金额=退款课程中“未完成的课堂数”÷“课程包含的课堂总数”x“购买时实际支付的金额”。
                    </li>
                    <li>
                        3.退款成功后，所有退款将返还至用户的原支付账户，且
                        <span className={css['text-focus']}>用户对应课程学习资格将会被注销，即不可再进行学习。</span>
                    </li>
                    <li>
                        <span className={css['text-focus']}>
                            课程购买成功后，课程资格即与用户购买课程时登录的微信号绑定，不可更改。
                        </span>
                    </li>
                    <li>
                        <span className={css['text-focus']}>
                            前端轻松学有权增加、减少、更换、全部取消除相应课程学习以外的其他附加服务，包括但不限于课程老师辅导答疑服务、班级群服务、助理服务等。
                        </span>
                    </li>
                    <li>
                        前端轻松学保留需要不时地制订、修改本协议的权利。如您不同意相关修改更新的内容或有异议，可以向我方提出说明并进行协商。
                        <br />
                        <br />
                        <br />
                        最新修订时间：2020年5月5日
                    </li>
                </ul>
            </div>
            <div
                className={css['agreement-model--icon']}
                onClick={() => {
                    close();
                }}
            >
                <img src="//static.xhxly.cn/close49jfj84j548jfhdhf48.png" />
            </div>
        </div>
    );
}
