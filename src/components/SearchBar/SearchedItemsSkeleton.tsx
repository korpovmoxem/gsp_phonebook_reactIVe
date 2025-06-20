import Skeleton from "react-loading-skeleton";
import {
    CustomDatalistItem,
    CustomDatalistItemHeader,
    CustomDatalistItemText,
} from "./StyledComponents";

export const SearchedItemsSkeleton = () => (
    <>
        {[...Array(10)].map((_, i) => (
            <CustomDatalistItem key={i}>
                <CustomDatalistItemHeader>
                    <Skeleton height={10} width={100} />
                </CustomDatalistItemHeader>
                <CustomDatalistItemText>
                    <Skeleton
                        style={{ marginTop: "10px" }}
                        height={10}
                        width={50}
                    />
                </CustomDatalistItemText>
            </CustomDatalistItem>
        ))}
    </>
);
