import "@/styles/main.css"
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-quartz.css"
import "@/styles/overrides.css"
import { VersionTag } from "@/components"
import { AdminProvider, UIProvider } from "@/contexts"
import { BaseWrapper } from "@/layouts"
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
import { SignalRProvider } from "./contexts/signalr.context"
import { About } from "./routes/about/about.route"
import { Docs } from "./routes/docs/docs.route"
import { Login } from "./routes/login/login.route"
import { Orders } from "./routes/orders/orders.route"
import { ChangePassword } from "./routes/profile/change-password.route"
import { Profile } from "./routes/profile/profile.route"
import { Remainings } from "./routes/remainings/remainings.route"
import { Rules } from "./routes/rules/rules.route"
import { StoreDetails } from "./routes/store-details/store-details.route"
import { Test } from "./routes/test.route"
import { Trade } from "./routes/trade/trade.route"
import { Transfers } from "./routes/transfers/transfers.route"

const versionStr = `v${version.major}.${version.minor}.${version.patch}.${version.stuff}-${version.mode || ""}-${currentUrlName}`

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
        <Switch>
          <Route path="/login" component={Login} />
          <AdminProvider>
            <UIProvider>
              <BaseWrapper>
                <Switch>
                  <Route path="/" component={Trade} />
                  <Route path="/profile" component={Profile} />
                  <Route path="/profile/change-password" component={ChangePassword} />
                  <Route path="/orders" component={Orders} />
                  <Route path="/remainings" component={Remainings} />
                  <Route path="/docs" component={Docs} />
                  <Route path="/transfers" component={Transfers} />
                  <Route path="/store-details" component={StoreDetails} />
                  <Route path="/about" component={About} />
                  <Route path="/rules" component={Rules} />
                  <Route path="/test" component={Test} />
                  <Route path="*"> ۴۰۴ پیدا نشد </Route>
                </Switch>
              </BaseWrapper>
            </UIProvider>
          </AdminProvider>
        </Switch>
      </SignalRProvider>
    </SWRConfig>
    <VersionTag appType="client" version={versionStr} />
  </React.StrictMode>,
)
