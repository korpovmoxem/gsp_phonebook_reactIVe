import Skeleton from "react-loading-skeleton";

export const EmployeeSkeleton = () => (
    <div style={{ padding: 10 }}>
        <h3 style={{ margin: "0 15px 10px" }}>Сотрудники</h3>
        {[...Array(10)].map((_, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
                <Skeleton height={20} />
            </div>
        ))}
    </div>
);
