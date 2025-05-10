import { Btn, LabeledInput, LabeledUploadInput } from "@/components"
import { logOut, transparentLog as tl, uploadFile } from "@/helpers"
import { FloppyDiskBack, UserCircle } from "@phosphor-icons/react"
import { apiClient } from "emex-shared/services/api-client"
import Cookies from "js-cookie"
import { toast } from "react-toastify"
import tw from "tailwind-styled-components"
import { Link } from "wouter"

const StyledForm = tw.form`grid sm:grid-cols-2 gap-y-6 gap-x-4 items-end`

function objToKeyVal(obj) {
  return {
    dataVal: Object.keys(obj).map(key => ({
      key: capitalize(key),
      val: obj[key],
    })),
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
function loweralize(str) {
  return str.charAt(0).toLowerCase() + str.slice(1)
}

export function ProfileForm() {
  async function handleSubmit(e) {
    e.preventDefault()

    const nameField = e.target.displayName
    const profileImageField = e.target.profileImage

    let imageUrlHolder = null

    if (profileImageField.files.length > 0) {
      imageUrlHolder = await uploadFile(profileImageField.files[0])
    }

    const oldName = Cookies.get("name")
    const hasNameChanged = nameField.value !== oldName
    const hasImageChanged = imageUrlHolder !== null

    if (!hasNameChanged && !hasImageChanged) {
      toast.info("تغییری انجام نشده است")
      return
    }

    const dataToSend = objToKeyVal(
      tl({
        ...(hasNameChanged && { name: nameField.value }),
        ...(hasImageChanged && { logoUrl: imageUrlHolder }),
      }),
    )

    apiClient.fetch({
      endpoint: "/Master/UpdateF",
      method: "POST",
      body: JSON.stringify(dataToSend),
      onSuccess() {
        dataToSend.dataVal.map(item => Cookies.set(loweralize(item.key), item.val))
        toast.success("با موفقیت انجام شد")
        logOut()
      },
    })
  }

  return (
    <StyledForm onSubmit={handleSubmit}>
      <LabeledInput
        defaultValue={Cookies.get("name")}
        name="displayName"
        dir="rtl"
        type="text"
        label="نام:"
      />
      <LabeledUploadInput name="profileImage" label="عکس پروفایل:" />
      <Btn onClick={logOut} type="button" icon={UserCircle}>
        خروج از حساب
      </Btn>
      <Btn type="submit" themeType="filled" theme="primary" icon={FloppyDiskBack}>
        دخیره
      </Btn>
      <p className="text-center sm:col-span-2">
        اینجا میتونین
        <Link className="text-amberdark-9 underline" href="/profile/change-password">
          رمزتون رو عوض کنین
        </Link>
      </p>
    </StyledForm>
  )
}
