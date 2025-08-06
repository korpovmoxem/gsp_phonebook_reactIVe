import "react-loading-skeleton/dist/skeleton.css";
import { CustomSkeleton } from "../StyledComponents";

interface Props {
    title?: string;
}

export const SidebarSkeleton = ({ title }: Props) => (
    <div style={{ padding: 10 }}>
        <h3 style={{ margin: "0 15px 10px" }}>{title || ""}</h3>
        {[...Array(20)].map((_, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
                <CustomSkeleton height={20} width={200} />
            </div>
        ))}
    </div>
);
