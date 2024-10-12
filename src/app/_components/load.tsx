import { Skeleton } from "antd";

export default function Load({rows=8}:{rows?: number}) {
  return (
    <Skeleton paragraph={{ rows}} />
  )
}