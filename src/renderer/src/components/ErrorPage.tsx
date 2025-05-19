export default function ErrorPage(props: { error: Error; resetErrorBoundary: Function }) {
  return (
    <div className="flex h-full w-full items-center justify-center text-red-500">
      發生錯誤! 請重新載入或重啟應用程式
      <br />
      {props.error.toString()}
    </div>
  )
}
