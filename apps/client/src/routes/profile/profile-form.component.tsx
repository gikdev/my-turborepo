import { Btn, LabeledInput, LabeledTextarea } from "@/components"
import { useProfileContext } from "@/contexts/profile"
import { logOut, uploadFile } from "@/helpers"
import { FloppyDiskBack, UserCircle } from "@phosphor-icons/react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import tw from "tailwind-styled-components"
import type { CustomerLoginModel } from "vgold-shared/gen-types"
import { apiClient } from "vgold-shared/services/api-client"
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
  const { profile, setProfile } = useProfileContext()

  const { register, handleSubmit } = useForm<ProfileFormValues>({
    defaultValues: {
      displayName: profile?.displayName ?? "",
      city: profile?.city ?? "",
      codeMelli: profile?.codeMelli ?? "",
      kasbsID: profile?.kasbsID ?? "",
      melliID: profile?.melliID ?? "",
      address: profile?.address ?? "",
    },
  })

  async function onSubmit(data: ProfileFormValues) {
    if (data.kasbsID instanceof FileList) {
      const kasbsIDRes = await uploadFile(data.kasbsID[0], true)
      const kasbsID = kasbsIDRes ?? data.kasbsID
      setProfile(p => ({
        ...p,
        kasbsID: String(kasbsID),
      }))
    }
    if (data.melliID instanceof FileList) {
      const melliIDRes = await uploadFile(data.melliID[0], true)
      const melliID = melliIDRes ?? data.melliID
      setProfile(p => ({
        ...p,
        melliID: String(melliID),
      }))
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

    const fixedData: CustomerLoginModel = {
      ...data,
      kasbsID: typeof data.kasbsID === "string" ? data.kasbsID : String(data.kasbsID),
      melliID: typeof data.melliID === "string" ? data.melliID : String(data.melliID),
    }

    apiClient.fetch({
      endpoint: "/Customer/UpdateF",
      method: "POST",
      body: JSON.stringify(dataToSend),
      onSuccess() {
        setProfile(p => ({ ...p, ...fixedData }))
        toast.success("با موفقیت انجام شد")
      },
    })
  }

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <LabeledInput {...register("displayName")} dir="rtl" type="text" label="نام:" />
      <LabeledInput defaultValue={profile?.mobile} disabled label="موبایل:" />
      <LabeledInput {...register("city")} dir="rtl" type="text" label="شهر:" />
      <LabeledInput {...register("codeMelli")} type="number" label="کدملی:" />
      <LabeledUploadInput
        {...register("kasbsID")}
        labelText="آیدی کسب:"
        secondLabel={<GUIDLink guid={profile?.kasbsID} />}
      />
      <LabeledUploadInput
        {...register("melliID")}
        labelText="آیدی ملی:"
        secondLabel={<GUIDLink guid={profile?.melliID} />}
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
