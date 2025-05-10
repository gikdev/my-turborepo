import { Btn, LabeledInput, LabeledTextarea } from "@/components"
import { logOut, uploadFile } from "@/helpers"
import { FloppyDiskBack, UserCircle } from "@phosphor-icons/react"
import { apiClient } from "vgold-shared/services/api-client"
import Cookies from "js-cookie"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import tw from "tailwind-styled-components"
import { Link } from "wouter"
import { GUIDLink } from "./guid-link.component"
import { LabeledUploadInput } from "./labeled-upload-input.component"

const StyledForm = tw.form`grid sm:grid-cols-2 gap-y-6 gap-x-4 items-end`

function objToKeyVal(obj: ProfileFormValues) {
  return {
    dataVal: Object.keys(obj).map(key => ({
      key: capitalize(key),
      val: obj[key],
    })),
  }
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
function loweralize(str: string) {
  return str.charAt(0).toLowerCase() + str.slice(1)
}

function handleLogOut() {
  apiClient.fetch({
    endpoint: "/Customer/logout",
    method: "PUT",
    onFinally: () => logOut(),
  })
}

interface ProfileFormValues {
  displayName: string
  city: string
  codeMelli: string
  kasbsID: FileList | string
  melliID: FileList | string
  address: string
}

export function ProfileForm() {
  const { register, handleSubmit } = useForm<ProfileFormValues>({
    defaultValues: {
      displayName: Cookies.get("displayName") ?? "",
      city: Cookies.get("city") ?? "",
      codeMelli: Cookies.get("codeMelli") ?? "",
      kasbsID: Cookies.get("kasbsID") ?? "",
      melliID: Cookies.get("melliID") ?? "",
      address: Cookies.get("address") ?? "",
    },
  })

  async function onSubmit(data: ProfileFormValues) {
    if (data.kasbsID instanceof FileList) {
      const kasbsIDRes = await uploadFile(data.kasbsID[0], true)
      const kasbsID = kasbsIDRes ?? data.kasbsID
      Cookies.set("kasbsID", String(kasbsID))
    }
    if (data.melliID instanceof FileList) {
      const melliIDRes = await uploadFile(data.melliID[0], true)
      const melliID = melliIDRes ?? data.melliID
      Cookies.set("melliID", String(melliID))
    }

    // biome-ignore lint/performance/noDelete: <explanation>
    delete data.kasbsID
    // biome-ignore lint/performance/noDelete: <explanation>
    delete data.melliID

    const dataToSend = objToKeyVal(data)

    const isNotValid = dataToSend?.dataVal.some(
      item => item.key === "DisplayName" && !String(item.val).trim(),
    )

    if (isNotValid) {
      toast.error("نام وارد نشده است")
      return
    }

    apiClient.fetch({
      endpoint: "/Customer/UpdateF",
      method: "POST",
      body: JSON.stringify(dataToSend),
      onSuccess() {
        dataToSend.dataVal.map(item => Cookies.set(loweralize(item.key), String(item.val)))
        toast.success("با موفقیت انجام شد")
      },
    })
  }

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <LabeledInput {...register("displayName")} dir="rtl" type="text" label="نام:" />
      <LabeledInput defaultValue={Cookies.get("mobile")} disabled label="موبایل:" />
      <LabeledInput {...register("city")} dir="rtl" type="text" label="شهر:" />
      <LabeledInput {...register("codeMelli")} type="number" label="کدملی:" />
      <LabeledUploadInput
        {...register("kasbsID")}
        labelText="آیدی کسب:"
        secondLabel={<GUIDLink guid={Cookies.get("kasbsID")} />}
      />
      <LabeledUploadInput
        {...register("melliID")}
        labelText="آیدی ملی:"
        secondLabel={<GUIDLink guid={Cookies.get("melliID")} />}
      />
      <LabeledTextarea {...register("address")} dir="rtl" label="آدرس:" />

      <div className="flex flex-col gap-4">
        <Btn type="submit" themeType="filled" theme="primary" icon={FloppyDiskBack}>
          دخیره
        </Btn>
        <Btn onClick={handleLogOut} type="button" icon={UserCircle}>
          خروج از حساب
        </Btn>
      </div>
      <p className="text-center sm:col-span-2">
        اینجا میتونین{" "}
        <Link className="text-amberdark-9 underline" href="/profile/change-password">
          رمزتون رو عوض کنین
        </Link>
      </p>
    </StyledForm>
  )
}
