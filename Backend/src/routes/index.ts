import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRotues } from "../modules/auth/auth.route";
import { ItemRoutes } from "../modules/item/item.route";
import { RentalRoutes } from "../modules/rental/rental.route";
import { ReviewRoutes } from "../modules/review/review.route";
import { NotificationRoutes } from "../modules/notification/notification.route";
import { DashboardRoutes } from "../modules/dashboard/dashboard.route";
import { TransactionRoutes } from "../modules/transaction/transaction.route";
import { CartRoutes } from "../modules/cart/cart.route";
import { RefundRoutes } from "../modules/refund/refund.route";
import { ReportRoutes } from "../modules/report/report.route";
import { EventRoutes } from "../modules/event/event.route";
import { MessageRoutes } from "../modules/message/message.route";
import { WalletRoutes } from "../modules/wallet/wallet.route";

export const router = Router()

const moduleRoutes = [
    {
        path:'/user',
        route: UserRoutes,
    },{
        path: '/auth',
        route: AuthRotues
    },{
        path: '/item',
        route: ItemRoutes
    },{
        path: '/rental',
        route: RentalRoutes
    },{
        path: '/review',
        route: ReviewRoutes
    },{
        path: '/notification',
        route: NotificationRoutes
    },{
        path: '/dashboard',
        route: DashboardRoutes
    },{
        path: '/transaction',
        route: TransactionRoutes
    },{
        path: '/cart',
        route: CartRoutes
    },{
        path: '/refund',
        route: RefundRoutes
    },{
        path: '/report',
        route: ReportRoutes
    },{
        path: '/event',
        route: EventRoutes
    },{
        path: '/message',
        route: MessageRoutes
    },{
        path: '/wallet',
        route: WalletRoutes
    }
]


moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});