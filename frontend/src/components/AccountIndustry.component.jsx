
// import { useGetAccIndustriesQuery } from "../store/api.reducer"
// import BarChart from "./BarChart.component"
// import StackedBar from "./StackedBar/StackedBar.component"
// import LineChart from "./LineChart.component"
// import Spinner from "./Spinner.component"
// import BarChart2 from "./BarChart2.component"
import BarChart3 from "./BarChart3.component"
// import DonutChart from "./DonutChart.component"

const AccountIndustry = () => {
    // const { data, isLoading } = useGetAccIndustriesQuery()

    // if (isLoading) {
    //     return <Spinner />
    // }

    // console.log({data})
    return (
        <div>
            {/* <LineChart /> */}
            {/* <BarChart />
            <StackedBar /> */}
            {/* <BarChart2 /> */}
            <BarChart3 />
            {/* <DonutChart /> */}
        </div>
    )
}

export default AccountIndustry