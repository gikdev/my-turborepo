import "@/styles/main.css"
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-quartz.css"
import "@/styles/overrides.css"
// -----
import { VersionTag } from "@/components"
import { AdminProvider, OnlineUsersCountProvider, UIProvider } from "@/contexts"
import { SignalRProvider } from "@/contexts/signalr.context"
// -----
import { BaseWrapper } from "@/layouts"
// -----
import { Capacitor } from "@capacitor/core"
import { StatusBar, Style } from "@capacitor/status-bar"
import * as Sentry from "@sentry/react"
import React from "react"
import ReactDOM from "react-dom/client"
import { Toaster } from "react-hot-toast"
import { Bounce, ToastContainer } from "react-toastify"
import { SWRConfig } from "swr"
import { Route, Switch } from "wouter"
import { currentUrlName, version } from "../stuffer.config.json"
import { EditAbout } from "./routes/(edit)/edit-about/edit-about.route"
import { EditHome } from "./routes/(edit)/edit-home/edit-home.route"
import { EditRules } from "./routes/(edit)/edit-rules/edit-rules.route"
import { CustomerRemaining } from "./routes/customer-remaining/customer-remaining.route"
import { CustomerId } from "./routes/customers/[id].route"
import { Customers } from "./routes/customers/customers.route"
import { Manage as ManageCustomers } from "./routes/customers/manage/manage.route"
import { Docs } from "./routes/docs/docs.route"
import { GroupsGram } from "./routes/groups-gram/groups-gram.route"
import { Manage as ManageGroupsGram } from "./routes/groups-gram/manage/manage.route"
import { GroupsNumber } from "./routes/groups-number/groups-number.route"
import { Manage as ManageGroupsNumber } from "./routes/groups-number/manage/manage.route"
import { Home } from "./routes/home/home.route"
import { Login } from "./routes/login/login.route"
import { OnlineUsers } from "./routes/online-users/online-users.route"
import { Orders } from "./routes/orders/orders.route"
import { Manage as ManagePriceSources } from "./routes/price-sources/manage/manage.route"
import { PriceSources } from "./routes/price-sources/price-sources.route"
import { Manage as ManageProduct } from "./routes/products/manage/manage.route"
import { Products } from "./routes/products/products.route"
import { ChangePassword } from "./routes/profile/change-password/change-password.route"
import { Profile } from "./routes/profile/profile.route"
import { Remaining } from "./routes/remaining/remaining.route"
import { SendSMS } from "./routes/send-sms"
import { Test } from "./routes/test.route"
import { Transfers } from "./routes/transfers/transfers.route"

Sentry.init({
  dsn: "https://6f9571d84f19b10cfd7cc9c6bcbb40cb@sentry.hamravesh.com/8343",
  integrations: [Sentry.browserTracingIntegration({}), Sentry.replayIntegration()],
  tracePropagationTargets: ["localhost", "*.vahdigold.ir", /^https:\/\/.*\.vahdigold\.ir$/],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
})

if (Capacitor.isNativePlatform()) {
  StatusBar.setOverlaysWebView({ overlay: false })
  StatusBar.setStyle({ style: Style.Dark })
}

const versionStr = `v${version.major}.${version.minor}.${version.patch}.${version.stuff}-${version.mode || ""}-${currentUrlName}`

const container = document.querySelector("#root")
const root = ReactDOM.createRoot(container)
root.render(
  <React.StrictMode>
    <Toaster toastOptions={{ position: "bottom-left" }} />
    <ToastContainer
      position="bottom-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick={false}
      rtl
      pauseOnFocusLoss
      draggable
      style={{ fontFamily: "Vazirmatn" }}
      pauseOnHover
      theme="dark"
      transition={Bounce}
    />
    <SWRConfig value={{ dedupingInterval: 0 }}>
      <SignalRProvider>
        <AdminProvider>
          <UIProvider>
            <OnlineUsersCountProvider>
              <Switch>
                <Route path="/login" component={Login} />
                <Route>
                  <BaseWrapper>
                    <Switch>
                      <Route path="/" component={Home} />

                      <Route path="/profile" component={Profile} />
                      <Route path="/profile/change-password" component={ChangePassword} />

                      <Route path="/customers" component={Customers} />
                      <Route path="/customers/manage" component={ManageCustomers} />
                      <Route path="/customers/:id" component={CustomerId} />

                      <Route path="/groups-number" component={GroupsNumber} />
                      <Route path="/groups-number/manage" component={ManageGroupsNumber} />
                      <Route path="/groups-gram" component={GroupsGram} />
                      <Route path="/groups-gram/manage" component={ManageGroupsGram} />

                      <Route path="/price-sources" component={PriceSources} />
                      <Route path="/price-sources/manage" component={ManagePriceSources} />

                      <Route path="/products" component={Products} />
                      <Route path="/products/manage" component={ManageProduct} />

                      <Route path="/remaining" component={Remaining} />
                      <Route path="/customer-remaining" component={CustomerRemaining} />

                      <Route path="/orders" component={Orders} />
                      <Route path="/transfers" component={Transfers} />
                      <Route path="/docs" component={Docs} />
                      <Route path="/online-users" component={OnlineUsers} />
                      <Route path="/send-sms" component={SendSMS} />

                      <Route path="/edit-home" component={EditHome} />
                      <Route path="/edit-rules" component={EditRules} />
                      <Route path="/edit-about" component={EditAbout} />

                      <Route path="/test" component={Test} />
                      <Route path="*"> ۴۰۴ پیدا نشد </Route>
                    </Switch>
                  </BaseWrapper>
                </Route>
              </Switch>
            </OnlineUsersCountProvider>
          </UIProvider>
        </AdminProvider>
      </SignalRProvider>
    </SWRConfig>
    <VersionTag appType="admin" version={versionStr} />
  </React.StrictMode>,
)

window.addEventListener("DOMContentLoaded", () => {
  navigator?.serviceWorker?.register("/sw.js")
})
