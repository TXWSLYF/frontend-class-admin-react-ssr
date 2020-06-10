import css from './index.module.scss';
// import HeaderBar from '../HeaderBar';
import HorizontalMenu from '../HorizontalMenu';
import { PropsWithChildren } from 'react';

export default function AdminPage(props: PropsWithChildren<unknown>) {
    return (
        <div className={css['admin-page']}>
            <HorizontalMenu />
            <main>
                <div className={css['admin-page-content']}>{props.children}</div>
            </main>
        </div>
    );
}
