import { useState, useEffect } from "react";
import { Organization } from "../types";
import styled from "styled-components";
import { SquareChevronRight, SquareChevronDown } from "lucide-react";

interface Props {
    node: Organization;
    selectedId: string | null;
    onSelect: (id: Organization) => void;
    expandedIds: string[];
}
const ChevronDownButton = styled(SquareChevronDown)`
    cursor: pointer;
    stroke: #1d75bb;
    &:hover {
        stroke: #1d74bb8a;
    }
`;

const ChevronRightButton = styled(SquareChevronRight)`
    cursor: pointer;
    stroke: #1d75bb;
    &:hover {
        stroke: #1d74bb8a;
    }
`;

export const ItemText = styled.span`
    user-select: none;
    margin-left: 10px;
    letter-spacing: 0.57;
    &:hover {
        color: #00000070;
    }
`;

const DEFAULT_EXPAND_ICON_SIZE = 18;

export const TreeNode = ({
    node,
    selectedId,
    onSelect,
    expandedIds,
}: Props) => {
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        console.log("Проверка на открытие ветки");
        if (expandedIds.includes(node.id)) {
            console.log("MATCHED");
            console.log(expandedIds);
            console.log(node);
        }

        setExpanded(expandedIds.includes(node.id));
    }, [expandedIds]);

    return (
        <div
            style={{
                marginLeft: 10,
                marginTop: 5,
                // borderBottom: "1px dashed rgb(197, 197, 197)",
            }}
        >
            <div
                onClick={() => {
                    node.id.length > 3
                        ? onSelect(node)
                        : setExpanded((prev) => !prev);
                }}
                style={{
                    cursor: "pointer",
                    fontWeight: node.id === selectedId ? "bold" : "normal",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: "7px",
                    lineHeight: 1,
                }}
            >
                {node.children.length > 0 && (
                    <span
                        onClick={(e) => {
                            e.stopPropagation();
                            setExpanded((prev) => !prev);
                        }}
                    >
                        {expanded ? (
                            <ChevronDownButton
                                size={DEFAULT_EXPAND_ICON_SIZE}
                            />
                        ) : (
                            <ChevronRightButton
                                size={DEFAULT_EXPAND_ICON_SIZE}
                            />
                        )}
                    </span>
                )}{" "}
                <ItemText>{node.name}</ItemText>
            </div>

            {expanded &&
                node.children.map((child, index) => (
                    <TreeNode
                        key={`${child.id}__${index}`}
                        node={child}
                        selectedId={selectedId}
                        onSelect={onSelect}
                        expandedIds={expandedIds}
                    />
                ))}
        </div>
    );
};

// {
//     "result": [
//         {
//             "id": "7704028125",
//             "name": "ПАО «Газпром автоматизация»",
//             "root": true,
//             "children": [
//                 {
//                     "id": "2",
//                     "name": "Обособленные подразделения",
//                     "filial": 1,
//                     "organizationId": "7704028125",
//                     "children": [
//                         {
//                             "id": "164acfd9-ade7-11ed-89e5-001dd8b71c55",
//                             "name": "Обособленное подразделение в г.Санкт-Петербург",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "6c2fade4-8c84-11e7-827e-001dd8b71c55",
//                             "name": "Обособленное подразделение в г. Омск",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": [
//                                 {
//                                     "id": "accee99a-625c-11e8-8347-001dd8b71c55",
//                                     "name": "Управление МТО",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": [
//                                         {
//                                             "id": "94e67205-6820-11ea-85b4-001dd8b71c55",
//                                             "name": "Группа отчетности ОС",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         }
//                                     ]
//                                 },
//                                 {
//                                     "id": "2a132d1b-bb2f-11e8-8389-001dd8b71c55",
//                                     "name": "Группа сопровождения информационных технологий",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "90e7db63-3e7b-11e9-8430-001dd8b71c55",
//                                     "name": "Сметно-договорной отдел",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "55a98cb6-6842-11ea-85b4-001dd8b71c55",
//                                     "name": "Отдел разрешительной и исполнительной документации",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 }
//                             ]
//                         }
//                     ]
//                 },
//                 {
//                     "id": "1",
//                     "name": "Филиалы",
//                     "filial": 1,
//                     "organizationId": "7704028125",
//                     "children": [
//                         {
//                             "id": "a412409a-7bba-11e0-b5b7-0015174673b1",
//                             "name": "Филиал ПАО \"Газпром автоматизация\" в г. Санкт-Петербург",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": [
//                                 {
//                                     "id": "17cd1c00-ad0a-11ed-89e4-001dd8b71c55",
//                                     "name": "Отдел по разработке эксплуатационной и конструкторской документации",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "3cce75a2-ad0a-11ed-89e4-001dd8b71c55",
//                                     "name": "Отдел по разработке и тестированию систем технологической безопасности",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "c7ba01a0-385c-11ef-8ac7-001dd8b71c55",
//                                     "name": "Отдел административного и технического обеспечения",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "16adfdca-5ece-11e1-b01d-0015174673b1",
//                                     "name": "Отдел по техническому обслуживанию средств автоматизации",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "a412409b-7bba-11e0-b5b7-0015174673b1",
//                                     "name": "Отдел по созданию программного обеспечения систем",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "a412409c-7bba-11e0-b5b7-0015174673b1",
//                                     "name": "Отдел по созданию систем управления транспортом газа",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 }
//                             ]
//                         },
//                         {
//                             "id": "9e9d83ba-fd3a-11ed-8a52-001dd8b71c55",
//                             "name": "Филиал «ГСП - Информсервис»",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": [
//                                 {
//                                     "id": "2",
//                                     "name": "Обособленные подразделения",
//                                     "filial": 1,
//                                     "organizationId": "7704028125",
//                                     "children": [
//                                         {
//                                             "id": "c274dd68-fd68-11ed-8a52-001dd8b71c55",
//                                             "name": "Обособленное подразделение «Санкт-Петербург и Ленинградская область»",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": [
//                                                 {
//                                                     "id": "13d7d151-fd69-11ed-8a52-001dd8b71c55",
//                                                     "name": "Группа поддержки пользователей \"Санкт-Петербург\"",
//                                                     "filial": 0,
//                                                     "organizationId": "7704028125",
//                                                     "children": []
//                                                 },
//                                                 {
//                                                     "id": "51f2b349-fd69-11ed-8a52-001dd8b71c55",
//                                                     "name": "Группа поддержки пользователей информационных систем \"Санкт-Петербург\"",
//                                                     "filial": 0,
//                                                     "organizationId": "7704028125",
//                                                     "children": []
//                                                 },
//                                                 {
//                                                     "id": "6f192354-fd69-11ed-8a52-001dd8b71c55",
//                                                     "name": "Группа поддержки руководящего состава \"Санкт-Петербург\"",
//                                                     "filial": 0,
//                                                     "organizationId": "7704028125",
//                                                     "children": []
//                                                 },
//                                                 {
//                                                     "id": "83fbe8d3-fd69-11ed-8a52-001dd8b71c55",
//                                                     "name": "Группа поддержки пользователей \"Усть-Луга\"",
//                                                     "filial": 0,
//                                                     "organizationId": "7704028125",
//                                                     "children": []
//                                                 }
//                                             ]
//                                         },
//                                         {
//                                             "id": "924a8490-fd6a-11ed-8a52-001dd8b71c55",
//                                             "name": "Обособленное подразделение «Томск»",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": [
//                                                 {
//                                                     "id": "bc22e72f-fd6a-11ed-8a52-001dd8b71c55",
//                                                     "name": "Группа поддержки пользователей \"Томск\"",
//                                                     "filial": 0,
//                                                     "organizationId": "7704028125",
//                                                     "children": []
//                                                 },
//                                                 {
//                                                     "id": "ebe6a9b8-fd6a-11ed-8a52-001dd8b71c55",
//                                                     "name": "Группа поддержки пользователей \"Олекминск\"",
//                                                     "filial": 0,
//                                                     "organizationId": "7704028125",
//                                                     "children": []
//                                                 },
//                                                 {
//                                                     "id": "4fbc4b9e-fd6b-11ed-8a52-001dd8b71c55",
//                                                     "name": "Группа поддержки пользователей \"Омск\"",
//                                                     "filial": 0,
//                                                     "organizationId": "7704028125",
//                                                     "children": []
//                                                 },
//                                                 {
//                                                     "id": "882544ea-fd6b-11ed-8a52-001dd8b71c55",
//                                                     "name": "Группа поддержки пользователей \"Сковородино\"",
//                                                     "filial": 0,
//                                                     "organizationId": "7704028125",
//                                                     "children": []
//                                                 },
//                                                 {
//                                                     "id": "affdd0a4-fd6b-11ed-8a52-001dd8b71c55",
//                                                     "name": "Группа поддержки пользователей \"Алдан\"",
//                                                     "filial": 0,
//                                                     "organizationId": "7704028125",
//                                                     "children": []
//                                                 },
//                                                 {
//                                                     "id": "17c82cd1-fd6c-11ed-8a52-001dd8b71c55",
//                                                     "name": "Группа оснащения средствами телеметрии \"Алдан\"",
//                                                     "filial": 0,
//                                                     "organizationId": "7704028125",
//                                                     "children": []
//                                                 },
//                                                 {
//                                                     "id": "803de054-0114-11ee-8a5a-001dd8b71c55",
//                                                     "name": "Группа поддержки пользователей \"Южно-Сахалинск\"",
//                                                     "filial": 0,
//                                                     "organizationId": "7704028125",
//                                                     "children": []
//                                                 }
//                                             ]
//                                         },
//                                         {
//                                             "id": "afea375c-fd6d-11ed-8a52-001dd8b71c55",
//                                             "name": "Обособленное подразделение \"Новый Уренгой\"",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": [
//                                                 {
//                                                     "id": "f3da7cef-fd6d-11ed-8a52-001dd8b71c55",
//                                                     "name": "Группа поддержки пользователей \"Новый Уренгой\"",
//                                                     "filial": 0,
//                                                     "organizationId": "7704028125",
//                                                     "children": []
//                                                 }
//                                             ]
//                                         },
//                                         {
//                                             "id": "20536d15-fd71-11ed-8a52-001dd8b71c55",
//                                             "name": "Обособленное подразделение \"Иркутск\"",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": [
//                                                 {
//                                                     "id": "a4b1ea94-fd71-11ed-8a52-001dd8b71c55",
//                                                     "name": "Группа поддержки пользователей \"Иркутск\"",
//                                                     "filial": 0,
//                                                     "organizationId": "7704028125",
//                                                     "children": []
//                                                 },
//                                                 {
//                                                     "id": "d7b914f7-fd71-11ed-8a52-001dd8b71c55",
//                                                     "name": "Группа поддержки пользователей \"Ковыкта\"",
//                                                     "filial": 0,
//                                                     "organizationId": "7704028125",
//                                                     "children": []
//                                                 }
//                                             ]
//                                         },
//                                         {
//                                             "id": "0395e438-fd73-11ed-8a52-001dd8b71c55",
//                                             "name": "Обособленное подразделение \"Юг\"",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": [
//                                                 {
//                                                     "id": "1ebb9c00-fd73-11ed-8a52-001dd8b71c55",
//                                                     "name": "Группа поддержки пользователей \"Краснодар\"",
//                                                     "filial": 0,
//                                                     "organizationId": "7704028125",
//                                                     "children": []
//                                                 },
//                                                 {
//                                                     "id": "545a3eea-fd73-11ed-8a52-001dd8b71c55",
//                                                     "name": "Группа поддержки пользователей \"Нижний Новгород\"",
//                                                     "filial": 0,
//                                                     "organizationId": "7704028125",
//                                                     "children": []
//                                                 }
//                                             ]
//                                         },
//                                         {
//                                             "id": "0f0beeaf-fd5f-11ed-8a52-001dd8b71c55",
//                                             "name": "Обособленное подразделение \"Северо-Запад\"",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": [
//                                                 {
//                                                     "id": "aa4117d3-fd64-11ed-8a52-001dd8b71c55",
//                                                     "name": "Группа поддержки пользователей \"Харасавэй\"",
//                                                     "filial": 0,
//                                                     "organizationId": "7704028125",
//                                                     "children": []
//                                                 },
//                                                 {
//                                                     "id": "4d98adbc-fd65-11ed-8a52-001dd8b71c55",
//                                                     "name": "Группа поддержки пользователей \"Бованенково\"",
//                                                     "filial": 0,
//                                                     "organizationId": "7704028125",
//                                                     "children": []
//                                                 },
//                                                 {
//                                                     "id": "8f42052d-fd65-11ed-8a52-001dd8b71c55",
//                                                     "name": "Группа поддержки пользователей \"Воркута\"",
//                                                     "filial": 0,
//                                                     "organizationId": "7704028125",
//                                                     "children": []
//                                                 },
//                                                 {
//                                                     "id": "c5a24bbd-fd65-11ed-8a52-001dd8b71c55",
//                                                     "name": "Группа поддержки пользователей \"Грязовец\"",
//                                                     "filial": 0,
//                                                     "organizationId": "7704028125",
//                                                     "children": []
//                                                 },
//                                                 {
//                                                     "id": "fa563a9b-fd65-11ed-8a52-001dd8b71c55",
//                                                     "name": "Группа оснащения средствами телеметрии \"Харасавэй\"",
//                                                     "filial": 0,
//                                                     "organizationId": "7704028125",
//                                                     "children": []
//                                                 },
//                                                 {
//                                                     "id": "3d0e3166-fd66-11ed-8a52-001dd8b71c55",
//                                                     "name": "Группа оснащения средствами телеметрии \"Бованенково\"",
//                                                     "filial": 0,
//                                                     "organizationId": "7704028125",
//                                                     "children": []
//                                                 },
//                                                 {
//                                                     "id": "6d2700b5-fd5f-11ed-8a52-001dd8b71c55",
//                                                     "name": "Группа поддержки пользователей \"Уфа\"",
//                                                     "filial": 0,
//                                                     "organizationId": "7704028125",
//                                                     "children": []
//                                                 },
//                                                 {
//                                                     "id": "4db3f022-fd64-11ed-8a52-001dd8b71c55",
//                                                     "name": "Группа поддержки пользователей \"Ухта\"",
//                                                     "filial": 0,
//                                                     "organizationId": "7704028125",
//                                                     "children": []
//                                                 },
//                                                 {
//                                                     "id": "e493d9aa-f020-11ee-8ac3-001dd8b71c55",
//                                                     "name": "Группа поддержки пользователей \"Тамбей\"",
//                                                     "filial": 0,
//                                                     "organizationId": "7704028125",
//                                                     "children": []
//                                                 }
//                                             ]
//                                         }
//                                     ]
//                                 },
//                                 {
//                                     "id": "acb70275-0110-11ee-8a5a-001dd8b71c55",
//                                     "name": "Отдел по работе с персоналом",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "16a5403d-fd3b-11ed-8a52-001dd8b71c55",
//                                     "name": "Управление поддержки пользователей и обеспечения",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": [
//                                         {
//                                             "id": "2ae3d1b8-fd3b-11ed-8a52-001dd8b71c55",
//                                             "name": "Отдел ИТ обеспечения",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         },
//                                         {
//                                             "id": "3a78d709-fd3b-11ed-8a52-001dd8b71c55",
//                                             "name": "Отдел обработки обращений пользователей",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         }
//                                     ]
//                                 },
//                                 {
//                                     "id": "4ca4ac4a-fd3b-11ed-8a52-001dd8b71c55",
//                                     "name": "Управление связи и телекоммуникаций",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": [
//                                         {
//                                             "id": "c941f98b-004a-11ee-8a59-001dd8b71c55",
//                                             "name": "Отдел сетей связи",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         },
//                                         {
//                                             "id": "e25e85b6-004a-11ee-8a59-001dd8b71c55",
//                                             "name": "Отдел телефонии и радиосвязи",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         },
//                                         {
//                                             "id": "1fc38e9f-0111-11ee-8a5a-001dd8b71c55",
//                                             "name": "Отдел автоматизированных систем учета исходных данных",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         }
//                                     ]
//                                 },
//                                 {
//                                     "id": "6fce9634-fd40-11ed-8a52-001dd8b71c55",
//                                     "name": "Управление серверной инфраструктуры и системного программного обеспечения",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": [
//                                         {
//                                             "id": "ab9bce0a-0111-11ee-8a5a-001dd8b71c55",
//                                             "name": "Отдел мониторинга инфраструктуры и информационных систем",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         },
//                                         {
//                                             "id": "84d47acf-fd40-11ed-8a52-001dd8b71c55",
//                                             "name": "Отдел серверной инфраструктуры",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         },
//                                         {
//                                             "id": "93b79eed-fd40-11ed-8a52-001dd8b71c55",
//                                             "name": "Отдел операционных систем и системного программного обеспечения",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         }
//                                     ]
//                                 },
//                                 {
//                                     "id": "a3c7aa0a-fd40-11ed-8a52-001dd8b71c55",
//                                     "name": "Управление архитектуры и развития информационных систем",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": [
//                                         {
//                                             "id": "b4549967-fd40-11ed-8a52-001dd8b71c55",
//                                             "name": "Отдел руководителей ИТ проектов",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         },
//                                         {
//                                             "id": "c54689c7-fd40-11ed-8a52-001dd8b71c55",
//                                             "name": "Отдел организации внешней разработки",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         },
//                                         {
//                                             "id": "d2b7d767-fd40-11ed-8a52-001dd8b71c55",
//                                             "name": "Отдел прототипирования",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         }
//                                     ]
//                                 },
//                                 {
//                                     "id": "e4ef722b-fd40-11ed-8a52-001dd8b71c55",
//                                     "name": "Управление бизнес анализа и поддержки информационных систем",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": [
//                                         {
//                                             "id": "f5713498-fd40-11ed-8a52-001dd8b71c55",
//                                             "name": "Отдел общепроизводственных систем",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         },
//                                         {
//                                             "id": "07fe8a73-fd41-11ed-8a52-001dd8b71c55",
//                                             "name": "Отдел систем бухгалтерского и финансового учета",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         },
//                                         {
//                                             "id": "1546b9bf-fd41-11ed-8a52-001dd8b71c55",
//                                             "name": "Отдел систем материально-технического и логистического обеспечения",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         },
//                                         {
//                                             "id": "2584cbbc-fd41-11ed-8a52-001dd8b71c55",
//                                             "name": "Отдел систем управления автотранспортом и сервисами",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         },
//                                         {
//                                             "id": "359b7ee8-fd41-11ed-8a52-001dd8b71c55",
//                                             "name": "Отдел систем управления персоналом",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         },
//                                         {
//                                             "id": "43626f59-fd41-11ed-8a52-001dd8b71c55",
//                                             "name": "Отдел систем электронного документооборота",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         },
//                                         {
//                                             "id": "5680a60d-fd41-11ed-8a52-001dd8b71c55",
//                                             "name": "Отдел нормативно-справочной информации",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         },
//                                         {
//                                             "id": "6a270366-fd41-11ed-8a52-001dd8b71c55",
//                                             "name": "Отдел администрирования систем",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         }
//                                     ]
//                                 },
//                                 {
//                                     "id": "61b08979-fd54-11ed-8a52-001dd8b71c55",
//                                     "name": "Управление собственной разработки информационных систем",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": [
//                                         {
//                                             "id": "780e111f-fd54-11ed-8a52-001dd8b71c55",
//                                             "name": "Отдел разработки 1С",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         },
//                                         {
//                                             "id": "a6e667a1-fd54-11ed-8a52-001dd8b71c55",
//                                             "name": "Отдел эксплуатации систем управления базами данных",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         },
//                                         {
//                                             "id": "b7586aa6-fd54-11ed-8a52-001dd8b71c55",
//                                             "name": "Отдел тестирования программного обеспечения",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         }
//                                     ]
//                                 },
//                                 {
//                                     "id": "847ce768-fd5b-11ed-8a52-001dd8b71c55",
//                                     "name": "Управление информационной безопасности",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": [
//                                         {
//                                             "id": "9859495d-fd5b-11ed-8a52-001dd8b71c55",
//                                             "name": "Отдел организации сетевой безопасности",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         },
//                                         {
//                                             "id": "a8333ec4-fd5b-11ed-8a52-001dd8b71c55",
//                                             "name": "Отдел организации безопасности информационных систем",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         },
//                                         {
//                                             "id": "b88fb987-fd5b-11ed-8a52-001dd8b71c55",
//                                             "name": "Отдел эксплуатации КИТСО",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         }
//                                     ]
//                                 },
//                                 {
//                                     "id": "540388c1-fd5c-11ed-8a52-001dd8b71c55",
//                                     "name": "Планово-экономическое управление",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": [
//                                         {
//                                             "id": "607e414d-fd5c-11ed-8a52-001dd8b71c55",
//                                             "name": "Отдел экономики и финансов",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         },
//                                         {
//                                             "id": "6dbdda78-fd5c-11ed-8a52-001dd8b71c55",
//                                             "name": "Отдел сервиса договорной работы",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         }
//                                     ]
//                                 }
//                             ]
//                         }
//                     ]
//                 },
//                 {
//                     "id": "2b2c7fea-835f-11ec-8867-001dd8b71c55",
//                     "name": "Специализированное Управление \"Калининградгазавтоматика\"",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": [
//                         {
//                             "id": "a6a50cfe-5c5d-11ee-8a86-001dd8b71c55",
//                             "name": "Бухгалтерия",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "b2d3cb88-5c5d-11ee-8a86-001dd8b71c55",
//                             "name": "Отдел правового обеспечения и договорной работы",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "54315c50-ae99-11ed-89e6-001dd8b71c55",
//                             "name": "Производственно-диспетчерский отдел",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "b05eb8b9-ae99-11ed-89e6-001dd8b71c55",
//                             "name": "Отдел систем магнитного подвеса",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "1209ee0b-ae9a-11ed-89e6-001dd8b71c55",
//                             "name": "Отдел наладочных работ и внедрения",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "8c99050b-ae9a-11ed-89e6-001dd8b71c55",
//                             "name": "Участок сборки электрооборудования",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "b3d151f1-ae9a-11ed-89e6-001dd8b71c55",
//                             "name": "Участок сборки взрывозащищенного оборудования и КИПиА",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "c5dc2ecb-ae9a-11ed-89e6-001dd8b71c55",
//                             "name": "Производственно-наладочный участок",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "0f9be7ea-8363-11ec-8867-001dd8b71c55",
//                             "name": "Отдел взрывозащищенного оборудования и КИПиА",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "3dcc34ba-8363-11ec-8867-001dd8b71c55",
//                             "name": "Отдел систем автоматического управления газоперекачивающих агрегатов",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "84bd773e-8363-11ec-8867-001dd8b71c55",
//                             "name": "Отдел программного обеспечения систем автоматизации",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "9d843c6b-8363-11ec-8867-001dd8b71c55",
//                             "name": "Отдел проектирования автоматизированных систем управления",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "c60c039c-8363-11ec-8867-001dd8b71c55",
//                             "name": "Отдел информационной инфраструктуры",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "ea332c2f-8363-11ec-8867-001dd8b71c55",
//                             "name": "Отдел главного технолога",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": [
//                                 {
//                                     "id": "081d3c38-8364-11ec-8867-001dd8b71c55",
//                                     "name": "Сектор технологического оснащения",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "44977dea-8364-11ec-8867-001dd8b71c55",
//                                     "name": "Технологический сектор \"Электрика\"",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "6276efdc-8364-11ec-8867-001dd8b71c55",
//                                     "name": "Технологический сектор \"Механика\"",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "759dd30f-8364-11ec-8867-001dd8b71c55",
//                                     "name": "Архив нормативно-технической документации",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 }
//                             ]
//                         },
//                         {
//                             "id": "958c0485-8364-11ec-8867-001dd8b71c55",
//                             "name": "Механообрабатывающее производство",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": [
//                                 {
//                                     "id": "aedb61c3-8364-11ec-8867-001dd8b71c55",
//                                     "name": "Участок литейно-заготовительный",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "cd1a66a0-8364-11ec-8867-001dd8b71c55",
//                                     "name": "Участок гальванический",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "df562c9c-8364-11ec-8867-001dd8b71c55",
//                                     "name": "Участок механический",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "f144dc70-8364-11ec-8867-001dd8b71c55",
//                                     "name": "Участок металлоконструкций",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "c4f3a0d5-dc18-11ec-88d8-001dd8b71c55",
//                                     "name": "Участок инструментальный",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 }
//                             ]
//                         },
//                         {
//                             "id": "b26a2819-8365-11ec-8867-001dd8b71c55",
//                             "name": "Центральная испытательная лаборатория",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "dca14953-8365-11ec-8867-001dd8b71c55",
//                             "name": "Энергомеханический отдел",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "f1097544-8365-11ec-8867-001dd8b71c55",
//                             "name": "Группа по охране труда и промышленной безопасности, гражданской обороне и чрезвычайным ситуациям",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "5c7beb34-835f-11ec-8867-001dd8b71c55",
//                             "name": "Производственно-административная группа",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "bfce1217-8360-11ec-8867-001dd8b71c55",
//                             "name": "Административно-хозяйственный отдел",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "de7a2dee-8360-11ec-8867-001dd8b71c55",
//                             "name": "Отдел материально-ресурсного обеспечения",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": [
//                                 {
//                                     "id": "073bb6f8-8361-11ec-8867-001dd8b71c55",
//                                     "name": "Упаковочный участок",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 }
//                             ]
//                         },
//                         {
//                             "id": "1995a24e-8361-11ec-8867-001dd8b71c55",
//                             "name": "Отдел системотехники",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": [
//                                 {
//                                     "id": "3283c258-8361-11ec-8867-001dd8b71c55",
//                                     "name": "Сектор системотехники",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "4e8e748e-8361-11ec-8867-001dd8b71c55",
//                                     "name": "Лаборатория схемотехники",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "70b456ab-8361-11ec-8867-001dd8b71c55",
//                                     "name": "Сектор конструкторской документации",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 }
//                             ]
//                         },
//                         {
//                             "id": "8bfcea34-8361-11ec-8867-001dd8b71c55",
//                             "name": "Отдел электрооборудования",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": [
//                                 {
//                                     "id": "866b0f48-8362-11ec-8867-001dd8b71c55",
//                                     "name": "Сектор среднего напряжения",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "a2873229-8362-11ec-8867-001dd8b71c55",
//                                     "name": "Сектор низкого напряжения",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "c05e9b45-8362-11ec-8867-001dd8b71c55",
//                                     "name": "Сектор преобразовательной продукции",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "f265af68-8362-11ec-8867-001dd8b71c55",
//                                     "name": "Сектор механики",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 }
//                             ]
//                         }
//                     ]
//                 },
//                 {
//                     "id": "08b98f74-88e0-11ec-886e-001dd8b71c55",
//                     "name": "Управление делами",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": [
//                         {
//                             "id": "d8961aa1-b8c3-11ed-89f3-001dd8b71c55",
//                             "name": "Служба производственного мониторинга",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "61e2115c-88e0-11ec-886e-001dd8b71c55",
//                             "name": "Отдел документационного обеспечения и архивного хранения",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "960fb7c2-88e0-11ec-886e-001dd8b71c55",
//                             "name": "Отдел референтов, протокола, аналитики и контроля",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         }
//                     ]
//                 },
//                 {
//                     "id": "ee42ec65-8a44-11ec-8870-001dd8b71c55",
//                     "name": "Проектный офис \"Амурский ГПЗ\"",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": []
//                 },
//                 {
//                     "id": "9d025fea-8a59-11ec-8870-001dd8b71c55",
//                     "name": "Служба консолидированной и управленческой отчетности",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": []
//                 },
//                 {
//                     "id": "f1d30930-8d88-11ec-8874-001dd8b71c55",
//                     "name": "Группа ГОЧС и обеспечения пожарной безопасности",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": []
//                 },
//                 {
//                     "id": "84e91e32-8d89-11ec-8874-001dd8b71c55",
//                     "name": "Хозяйственная служба",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": [
//                         {
//                             "id": "a7325277-1bfa-11ee-8a7c-001dd8b71c55",
//                             "name": "Группа организации проезда и проживания персонала",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "aff68c5b-8d89-11ec-8874-001dd8b71c55",
//                             "name": "Медицинский пункт",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "c504fa6f-8d89-11ec-8874-001dd8b71c55",
//                             "name": "Транспортный участок",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "da67fc0c-8d89-11ec-8874-001dd8b71c55",
//                             "name": "Участок обслуживания зданий и сооружений",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         }
//                     ]
//                 },
//                 {
//                     "id": "f9e5a956-8f0e-11ec-8876-001dd8b71c55",
//                     "name": "Служба контроля качества",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": []
//                 },
//                 {
//                     "id": "065af4a3-8f37-11ec-8876-001dd8b71c55",
//                     "name": "Управление пусконаладочных работ",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": [
//                         {
//                             "id": "23b45a00-8f37-11ec-8876-001dd8b71c55",
//                             "name": "Отдел планирования и методологии",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "3b796409-8f37-11ec-8876-001dd8b71c55",
//                             "name": "Отдел организации пусконаладочных работ",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "577e1581-8f37-11ec-8876-001dd8b71c55",
//                             "name": "Отдел по работе с производителями оборудования",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         }
//                     ]
//                 },
//                 {
//                     "id": "eba94584-8fe4-11ec-8877-001dd8b71c55",
//                     "name": "Управление информационных технологий",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": [
//                         {
//                             "id": "1f2e2058-8fe7-11ec-8877-001dd8b71c55",
//                             "name": "Отдел сопровождения ИТ инфраструктуры",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "476b5d92-8fe7-11ec-8877-001dd8b71c55",
//                             "name": "Отдел технической поддержки",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "6264a145-8fe7-11ec-8877-001dd8b71c55",
//                             "name": "Отдел разработки",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "7e379375-8fe7-11ec-8877-001dd8b71c55",
//                             "name": "Отдел аналитики",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         }
//                     ]
//                 },
//                 {
//                     "id": "96b84d08-9867-11ec-8882-001dd8b71c55",
//                     "name": "Специализированное Управление \"Саратовгазавтоматика\"",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": [
//                         {
//                             "id": "d13cce67-9870-11ec-8882-001dd8b71c55",
//                             "name": "Производственная служба",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": [
//                                 {
//                                     "id": "7877b858-7d37-11ed-89a6-001dd8b71c55",
//                                     "name": "Производственный участок",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "1cf86405-61f7-11ee-8a87-001dd8b71c55",
//                                     "name": "Цех №5",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "c1229822-9882-11ec-8882-001dd8b71c55",
//                                     "name": "Заготовительный участок",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "dd11623c-9882-11ec-8882-001dd8b71c55",
//                                     "name": "Цех №1",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": [
//                                         {
//                                             "id": "ec677859-9882-11ec-8882-001dd8b71c55",
//                                             "name": "Механический участок",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         },
//                                         {
//                                             "id": "328e02d7-9883-11ec-8882-001dd8b71c55",
//                                             "name": "Слесарно-сварочный участок №1",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": [
//                                                 {
//                                                     "id": "53b82637-9883-11ec-8882-001dd8b71c55",
//                                                     "name": "бригада №1",
//                                                     "filial": 0,
//                                                     "organizationId": "7704028125",
//                                                     "children": []
//                                                 },
//                                                 {
//                                                     "id": "6431b41b-9883-11ec-8882-001dd8b71c55",
//                                                     "name": "бригада №2",
//                                                     "filial": 0,
//                                                     "organizationId": "7704028125",
//                                                     "children": []
//                                                 },
//                                                 {
//                                                     "id": "7564ab87-9883-11ec-8882-001dd8b71c55",
//                                                     "name": "бригада №3",
//                                                     "filial": 0,
//                                                     "organizationId": "7704028125",
//                                                     "children": []
//                                                 },
//                                                 {
//                                                     "id": "98fe27ce-9883-11ec-8882-001dd8b71c55",
//                                                     "name": "бригада №4",
//                                                     "filial": 0,
//                                                     "organizationId": "7704028125",
//                                                     "children": []
//                                                 },
//                                                 {
//                                                     "id": "aa06ac8a-9883-11ec-8882-001dd8b71c55",
//                                                     "name": "бригада №5",
//                                                     "filial": 0,
//                                                     "organizationId": "7704028125",
//                                                     "children": []
//                                                 },
//                                                 {
//                                                     "id": "ba02a975-9883-11ec-8882-001dd8b71c55",
//                                                     "name": "бригада №6",
//                                                     "filial": 0,
//                                                     "organizationId": "7704028125",
//                                                     "children": []
//                                                 },
//                                                 {
//                                                     "id": "1fc6ef10-9884-11ec-8882-001dd8b71c55",
//                                                     "name": "бригада №7",
//                                                     "filial": 0,
//                                                     "organizationId": "7704028125",
//                                                     "children": []
//                                                 },
//                                                 {
//                                                     "id": "33f82fe7-9884-11ec-8882-001dd8b71c55",
//                                                     "name": "бригада №8",
//                                                     "filial": 0,
//                                                     "organizationId": "7704028125",
//                                                     "children": []
//                                                 }
//                                             ]
//                                         },
//                                         {
//                                             "id": "49d37829-9884-11ec-8882-001dd8b71c55",
//                                             "name": "Малярный участок",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": [
//                                                 {
//                                                     "id": "292fe116-988b-11ec-8882-001dd8b71c55",
//                                                     "name": "бригада №1",
//                                                     "filial": 0,
//                                                     "organizationId": "7704028125",
//                                                     "children": []
//                                                 },
//                                                 {
//                                                     "id": "40ff3b05-988b-11ec-8882-001dd8b71c55",
//                                                     "name": "бригада №2",
//                                                     "filial": 0,
//                                                     "organizationId": "7704028125",
//                                                     "children": []
//                                                 },
//                                                 {
//                                                     "id": "577bd5a8-988b-11ec-8882-001dd8b71c55",
//                                                     "name": "бригада №3",
//                                                     "filial": 0,
//                                                     "organizationId": "7704028125",
//                                                     "children": []
//                                                 }
//                                             ]
//                                         }
//                                     ]
//                                 },
//                                 {
//                                     "id": "71e90e9e-988b-11ec-8882-001dd8b71c55",
//                                     "name": "Цех №2",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": [
//                                         {
//                                             "id": "f6bd85e9-988b-11ec-8882-001dd8b71c55",
//                                             "name": "Слесарно-сварочный участок №2",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         },
//                                         {
//                                             "id": "10d76e95-988c-11ec-8882-001dd8b71c55",
//                                             "name": "Слесарно-сварочный участок №3",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         },
//                                         {
//                                             "id": "24bbf791-988c-11ec-8882-001dd8b71c55",
//                                             "name": "Слесарный участок",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         }
//                                     ]
//                                 },
//                                 {
//                                     "id": "3f95e8a0-988c-11ec-8882-001dd8b71c55",
//                                     "name": "Цех №3",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": [
//                                         {
//                                             "id": "4c93f14a-988c-11ec-8882-001dd8b71c55",
//                                             "name": "Участок по сборке и электромонтажу шкафной продукции и ультразвуковых расходомеров",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         },
//                                         {
//                                             "id": "6a7463f0-988c-11ec-8882-001dd8b71c55",
//                                             "name": "Участок по сборке и электромонтажу инженерных систем блок-боксов",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         },
//                                         {
//                                             "id": "7c654583-988c-11ec-8882-001dd8b71c55",
//                                             "name": "Участок по сборке и электромонтажу технологического оборудования блок-боксов",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         }
//                                     ]
//                                 },
//                                 {
//                                     "id": "969c5a41-988c-11ec-8882-001dd8b71c55",
//                                     "name": "Цех №4",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": [
//                                         {
//                                             "id": "ad8acd0f-988c-11ec-8882-001dd8b71c55",
//                                             "name": "Участок упаковки",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": [
//                                                 {
//                                                     "id": "8933d52b-988e-11ec-8882-001dd8b71c55",
//                                                     "name": "бригада №1",
//                                                     "filial": 0,
//                                                     "organizationId": "7704028125",
//                                                     "children": []
//                                                 },
//                                                 {
//                                                     "id": "9f33e191-988e-11ec-8882-001dd8b71c55",
//                                                     "name": "бригада №2",
//                                                     "filial": 0,
//                                                     "organizationId": "7704028125",
//                                                     "children": []
//                                                 }
//                                             ]
//                                         },
//                                         {
//                                             "id": "e96dd4d2-988e-11ec-8882-001dd8b71c55",
//                                             "name": "Группа комплектования",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         },
//                                         {
//                                             "id": "05b57bb2-988f-11ec-8882-001dd8b71c55",
//                                             "name": "Группа сопроводительной документации",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         }
//                                     ]
//                                 }
//                             ]
//                         },
//                         {
//                             "id": "f7a4c57f-9870-11ec-8882-001dd8b71c55",
//                             "name": "Группа по охране труда и промышленной безопасности, гражданской обороне и чрезвычайным ситуациям",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "c6bb2105-12f1-11ed-891e-001dd8b71c55",
//                             "name": "Здравпункт",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "816b213e-9870-11ec-8882-001dd8b71c55",
//                             "name": "Служба технологической подготовки производства",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": [
//                                 {
//                                     "id": "045e028c-9882-11ec-8882-001dd8b71c55",
//                                     "name": "Отдел технологической подготовки производства",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "2bd0ec0f-9882-11ec-8882-001dd8b71c55",
//                                     "name": "Группа нормирования материалов и инструментов",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "53d4ca0c-9882-11ec-8882-001dd8b71c55",
//                                     "name": "Отдел главного сварщика",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 }
//                             ]
//                         },
//                         {
//                             "id": "b0e10220-9870-11ec-8882-001dd8b71c55",
//                             "name": "Инженерно-производственная служба КИПиА",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": [
//                                 {
//                                     "id": "6775f81b-9882-11ec-8882-001dd8b71c55",
//                                     "name": "Бюро ультразвуковой аппаратуры",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "816e100f-9882-11ec-8882-001dd8b71c55",
//                                     "name": "Бюро автоматики и технологического программирования",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "9a147a55-9882-11ec-8882-001dd8b71c55",
//                                     "name": "Участок сборки ультразвуковых датчиков",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 }
//                             ]
//                         },
//                         {
//                             "id": "c75a8889-986f-11ec-8882-001dd8b71c55",
//                             "name": "Отдел материально-ресурсного обеспечения",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": [
//                                 {
//                                     "id": "ba5e3a73-9871-11ec-8882-001dd8b71c55",
//                                     "name": "Склад материально-технических ресурсов",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 }
//                             ]
//                         },
//                         {
//                             "id": "ec4afa46-986f-11ec-8882-001dd8b71c55",
//                             "name": "Производственно-диспетчерская служба",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": [
//                                 {
//                                     "id": "fbf87b43-9871-11ec-8882-001dd8b71c55",
//                                     "name": "Производственно-технический отдел",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "135ad397-9872-11ec-8882-001dd8b71c55",
//                                     "name": "Бюро управления заказами",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "2035ec82-9872-11ec-8882-001dd8b71c55",
//                                     "name": "Группа производственного планирования",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 }
//                             ]
//                         },
//                         {
//                             "id": "1f3d859c-9870-11ec-8882-001dd8b71c55",
//                             "name": "Служба проектно-конструкторской подготовки производства",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": [
//                                 {
//                                     "id": "1db1e84d-9881-11ec-8882-001dd8b71c55",
//                                     "name": "Бюро технической документации",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "19fb6404-987e-11ec-8882-001dd8b71c55",
//                                     "name": "Конструкторский отдел №1",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": [
//                                         {
//                                             "id": "287ac610-987f-11ec-8882-001dd8b71c55",
//                                             "name": "Группа газораспределительных систем",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         },
//                                         {
//                                             "id": "53caeb06-987f-11ec-8882-001dd8b71c55",
//                                             "name": "Группа блочного оборудования газораспределительных систем",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         }
//                                     ]
//                                 },
//                                 {
//                                     "id": "67f493b4-987f-11ec-8882-001dd8b71c55",
//                                     "name": "Отдел проектной подготовки",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": [
//                                         {
//                                             "id": "8706a7d2-987f-11ec-8882-001dd8b71c55",
//                                             "name": "Группа перспективных разработок инженерных и автоматизированных систем",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         },
//                                         {
//                                             "id": "a1d0ad20-987f-11ec-8882-001dd8b71c55",
//                                             "name": "Группа перспективных разработок технологического оборудования",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         }
//                                     ]
//                                 },
//                                 {
//                                     "id": "b9b24e92-987f-11ec-8882-001dd8b71c55",
//                                     "name": "Конструкторский отдел №2",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": [
//                                         {
//                                             "id": "cff4c5bd-987f-11ec-8882-001dd8b71c55",
//                                             "name": "Группа блочно-модульных конструкций",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         },
//                                         {
//                                             "id": "dd2b0d24-987f-11ec-8882-001dd8b71c55",
//                                             "name": "Группа систем отопления, вентиляции и кондиционирования",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         }
//                                     ]
//                                 },
//                                 {
//                                     "id": "94c90b44-9880-11ec-8882-001dd8b71c55",
//                                     "name": "Конструкторский отдел №3",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": [
//                                         {
//                                             "id": "a6ca2562-9880-11ec-8882-001dd8b71c55",
//                                             "name": "Группа инженерных систем",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         },
//                                         {
//                                             "id": "e2867397-9880-11ec-8882-001dd8b71c55",
//                                             "name": "Группа контрольно-измерительных приборов и автоматики",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         },
//                                         {
//                                             "id": "fde76ac8-9880-11ec-8882-001dd8b71c55",
//                                             "name": "Группа энергетического оборудования",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         }
//                                     ]
//                                 }
//                             ]
//                         },
//                         {
//                             "id": "dc28398a-986f-11ec-8882-001dd8b71c55",
//                             "name": "Служба административного учета",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "ce0dfd51-7d37-11ed-89a6-001dd8b71c55",
//                             "name": "Группа АХО",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "85cd3210-986f-11ec-8882-001dd8b71c55",
//                             "name": "Бюро автоматизированной системы управления",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "0f8dc482-9871-11ec-8882-001dd8b71c55",
//                             "name": "Энергомеханический отдел",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "2417e810-9871-11ec-8882-001dd8b71c55",
//                             "name": "Отдел главного метролога",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "41c8c996-9871-11ec-8882-001dd8b71c55",
//                             "name": "Производственно-испытательная лаборатория неразрушающего контроля",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "5748576c-9871-11ec-8882-001dd8b71c55",
//                             "name": "Отдел информационной инфраструктуры",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "64d2b974-9871-11ec-8882-001dd8b71c55",
//                             "name": "Транспортная служба",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": [
//                                 {
//                                     "id": "3f8a21a5-988f-11ec-8882-001dd8b71c55",
//                                     "name": "Транспортный участок",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "5272c2c3-988f-11ec-8882-001dd8b71c55",
//                                     "name": "Участок погрузочно-разгрузочных работ и отгрузки готовой продукции",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 }
//                             ]
//                         },
//                         {
//                             "id": "76bbe91c-9871-11ec-8882-001dd8b71c55",
//                             "name": "Участок сервисных работ",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         }
//                     ]
//                 },
//                 {
//                     "id": "2d064cee-a369-11ec-8890-001dd8b71c55",
//                     "name": "Специализированное Управление в г. Краснодар",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": [
//                         {
//                             "id": "ae9c4848-a36d-11ec-8890-001dd8b71c55",
//                             "name": "Производственная служба",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": [
//                                 {
//                                     "id": "02ff061d-a36e-11ec-8890-001dd8b71c55",
//                                     "name": "Производственный участок №1",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 }
//                             ]
//                         }
//                     ]
//                 },
//                 {
//                     "id": "5ced4016-a369-11ec-8890-001dd8b71c55",
//                     "name": "Специализированное Управление в г. Томск",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": [
//                         {
//                             "id": "2fbb737f-a371-11ec-8890-001dd8b71c55",
//                             "name": "Производственно-административная группа",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "49f6024d-a371-11ec-8890-001dd8b71c55",
//                             "name": "Производственная служба",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": [
//                                 {
//                                     "id": "62e23588-a371-11ec-8890-001dd8b71c55",
//                                     "name": "Производственный участок №1",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "a26eca37-a371-11ec-8890-001dd8b71c55",
//                                     "name": "Производственный участок №2",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 }
//                             ]
//                         }
//                     ]
//                 },
//                 {
//                     "id": "a6f527e9-a369-11ec-8890-001dd8b71c55",
//                     "name": "Специализированное Управление в г. Надым",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": [
//                         {
//                             "id": "baf5fc03-a371-11ec-8890-001dd8b71c55",
//                             "name": "Производственно-административная группа",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         }
//                     ]
//                 },
//                 {
//                     "id": "3248d658-a36a-11ec-8890-001dd8b71c55",
//                     "name": "Специализированное Управление в г. Оренбург",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": [
//                         {
//                             "id": "3e7a2d25-d796-11ee-8ac1-001dd8b71c55",
//                             "name": "Производственно-технический отдел",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "656154ed-d796-11ee-8ac1-001dd8b71c55",
//                             "name": "Отдел охраны труда и промышленной безопасности",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "79494221-d796-11ee-8ac1-001dd8b71c55",
//                             "name": "Транспортный участок",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": [
//                                 {
//                                     "id": "9b4db7f6-d796-11ee-8ac1-001dd8b71c55",
//                                     "name": "Группа обслуживания вахтового персонала",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 }
//                             ]
//                         },
//                         {
//                             "id": "807daa07-ad03-11ed-89e4-001dd8b71c55",
//                             "name": "Группа профессиональной адаптации",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "0a7ee0e4-a373-11ec-8890-001dd8b71c55",
//                             "name": "Производственная служба",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": [
//                                 {
//                                     "id": "18476e72-a373-11ec-8890-001dd8b71c55",
//                                     "name": "Производственный участок №1",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "384a5fa6-a373-11ec-8890-001dd8b71c55",
//                                     "name": "Производственный участок №2",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "1f1ce92c-246e-11ed-8935-001dd8b71c55",
//                                     "name": "Производственный участок № 3",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "6d838c50-adc5-11ed-89e5-001dd8b71c55",
//                                     "name": "Производственный участок №4",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "2e1d5e84-d793-11ee-8ac1-001dd8b71c55",
//                                     "name": "Производственный участок №6",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "feb35c60-d793-11ee-8ac1-001dd8b71c55",
//                                     "name": "Производственный участок №7",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "2920840f-d794-11ee-8ac1-001dd8b71c55",
//                                     "name": "Производственный участок №8",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "fd97625c-d795-11ee-8ac1-001dd8b71c55",
//                                     "name": "Производственный участок №9",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "aaab3d43-6e79-11ee-8a8d-001dd8b71c55",
//                                     "name": "Производственный участок №5",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 }
//                             ]
//                         }
//                     ]
//                 },
//                 {
//                     "id": "5d339bfc-a36a-11ec-8890-001dd8b71c55",
//                     "name": "Специализированное Управление в г. Нижний Новгород",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": [
//                         {
//                             "id": "72c978ca-ad03-11ed-89e4-001dd8b71c55",
//                             "name": "Группа профессиональной адаптации",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "4561b14c-a373-11ec-8890-001dd8b71c55",
//                             "name": "Производственно-административная группа",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "b5e871e1-a373-11ec-8890-001dd8b71c55",
//                             "name": "Производственная служба",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": [
//                                 {
//                                     "id": "d5b23e93-a373-11ec-8890-001dd8b71c55",
//                                     "name": "Производственный участок №1",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "ed40a012-a373-11ec-8890-001dd8b71c55",
//                                     "name": "Производственный участок №2",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 }
//                             ]
//                         }
//                     ]
//                 },
//                 {
//                     "id": "ca3c5d03-af4c-11ec-889f-001dd8b71c55",
//                     "name": "Управление закупок",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": []
//                 },
//                 {
//                     "id": "0f856d38-af50-11ec-889f-001dd8b71c55",
//                     "name": "Производственно-диспетчерское управление",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": [
//                         {
//                             "id": "77a308ce-af50-11ec-889f-001dd8b71c55",
//                             "name": "Отдел планирования и анализа промышленного производства",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "b18ae3b1-af50-11ec-889f-001dd8b71c55",
//                             "name": "Отдел логистики и складского хозяйства",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "ff264502-af50-11ec-889f-001dd8b71c55",
//                             "name": "Отдел сводных балансов",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         }
//                     ]
//                 },
//                 {
//                     "id": "9441ea78-c173-11ec-88b6-001dd8b71c55",
//                     "name": "Инженерный центр приборостроения и метрологии",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": [
//                         {
//                             "id": "582f375f-c176-11ec-88b6-001dd8b71c55",
//                             "name": "Отдел метрологии",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "e2698df9-c174-11ec-88b6-001dd8b71c55",
//                             "name": "Отдел разработки информационно-измерительных систем",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "4d1d4484-c175-11ec-88b6-001dd8b71c55",
//                             "name": "Отдел разработки измерительных преобразователей и микропроцессорной техники",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         }
//                     ]
//                 },
//                 {
//                     "id": "29321827-e0ce-11ec-88de-001dd8b71c55",
//                     "name": "Отдел по взаимодействию с НИИ и профильными учебными заведениями",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": []
//                 },
//                 {
//                     "id": "87f4122c-e0ce-11ec-88de-001dd8b71c55",
//                     "name": "Группа сопровождения НИОКР",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": []
//                 },
//                 {
//                     "id": "a788e8ae-e0ce-11ec-88de-001dd8b71c55",
//                     "name": "Научно-методическая группа",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": []
//                 },
//                 {
//                     "id": "d1c05a2e-6fb1-11ed-8995-001dd8b71c55",
//                     "name": "Специализированное Управление в пгт. Афипский",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": [
//                         {
//                             "id": "01f87d6b-6fcf-11ed-8995-001dd8b71c55",
//                             "name": "Группа по охране труда, промышленной безопасности и экологии",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "cefbe4a7-6fda-11ed-8995-001dd8b71c55",
//                             "name": "Участок изготовления металлических конструкций",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "e971cffc-6fda-11ed-8995-001dd8b71c55",
//                             "name": "Участок сборки и окраски металлических конструкций",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "135af7b9-6fdb-11ed-8995-001dd8b71c55",
//                             "name": "Участок низковольтных комплектных устройств",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "3a52c93c-6fdb-11ed-8995-001dd8b71c55",
//                             "name": "Участок монтажа оборудования",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "d8f52f75-6fcf-11ed-8995-001dd8b71c55",
//                             "name": "Группа материально-технического обеспечения",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "19872f6d-6fd0-11ed-8995-001dd8b71c55",
//                             "name": "Производственно-техническая группа",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "a693fa9b-6fda-11ed-8995-001dd8b71c55",
//                             "name": "Заготовительный участок",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "84f941ce-6fdc-11ed-8995-001dd8b71c55",
//                             "name": "Энергомеханический участок",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "438bd4c5-6fef-11ed-8995-001dd8b71c55",
//                             "name": "Участок автотранспорта и спецтехники",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "6eeef184-6fef-11ed-8995-001dd8b71c55",
//                             "name": "Центральный склад",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "8cdba85e-6fef-11ed-8995-001dd8b71c55",
//                             "name": "Хозяйственная служба",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "4f4669b8-76cd-11ed-899e-001dd8b71c55",
//                             "name": "Производственно-административная группа",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "7c302aff-76cd-11ed-899e-001dd8b71c55",
//                             "name": "Конструкторский отдел",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": [
//                                 {
//                                     "id": "2",
//                                     "name": "Обособленные подразделения",
//                                     "filial": 1,
//                                     "organizationId": "7704028125",
//                                     "children": [
//                                         {
//                                             "id": "8b7a2a89-76cf-11ed-899e-001dd8b71c55",
//                                             "name": "Группа разработки проектов электрооборудования и ОПС",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         }
//                                     ]
//                                 },
//                                 {
//                                     "id": "b6a75160-76cf-11ed-899e-001dd8b71c55",
//                                     "name": "Группа разработки проектов НКУ",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "cbe8324f-76cf-11ed-899e-001dd8b71c55",
//                                     "name": "Группа разработки проектов металлоконструкций",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 }
//                             ]
//                         },
//                         {
//                             "id": "e020e098-76cd-11ed-899e-001dd8b71c55",
//                             "name": "Участок наладки оборудования и сервиса",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "06d901a8-1428-11ee-8a70-001dd8b71c55",
//                             "name": "Участок отгрузки продукции",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "30f7bc5e-1428-11ee-8a70-001dd8b71c55",
//                             "name": "Группа по претензионной работе и сопровождению продукции",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         }
//                     ]
//                 },
//                 {
//                     "id": "718361da-ab9e-11ed-89e2-001dd8b71c55",
//                     "name": "Специализированное Управление \"Тверьгазавтоматика\"",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": [
//                         {
//                             "id": "b100a9cb-69bb-11ee-8a8c-001dd8b71c55",
//                             "name": "Отдел проектирования архитектурно-строительных решений",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "a7a548e0-aba4-11ed-89e2-001dd8b71c55",
//                             "name": "Административно-хозяйственная группа",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "e957a8f0-aba4-11ed-89e2-001dd8b71c55",
//                             "name": "Отдел по работе с исполнительной документацией",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "013cafc6-aba5-11ed-89e2-001dd8b71c55",
//                             "name": "Отдел разработки сметной документации",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "264df1e7-aba5-11ed-89e2-001dd8b71c55",
//                             "name": "Отдел проектирования систем автоматизации",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "37a5d72e-aba5-11ed-89e2-001dd8b71c55",
//                             "name": "Отдел проектирования систем электроснабжения",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "4f86b162-aba5-11ed-89e2-001dd8b71c55",
//                             "name": "Отдел проектирования систем связи",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "af8def02-aba5-11ed-89e2-001dd8b71c55",
//                             "name": "Отдел инжиниринговых работ",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         }
//                     ]
//                 },
//                 {
//                     "id": "30bd4d70-ade5-11ed-89e5-001dd8b71c55",
//                     "name": "Управление по реализации стратегических проектов",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": [
//                         {
//                             "id": "d17f27e7-ade5-11ed-89e5-001dd8b71c55",
//                             "name": "Отдел планирования, контроля и сопровождения проектов",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "e111f44f-ade5-11ed-89e5-001dd8b71c55",
//                             "name": "Отдел закупок и подготовки производства",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "f49b41d8-ade5-11ed-89e5-001dd8b71c55",
//                             "name": "Отдел систем связи",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "702f6553-ade6-11ed-89e5-001dd8b71c55",
//                             "name": "Отдел системно-технической инфраструктуры",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "8816c75a-ade6-11ed-89e5-001dd8b71c55",
//                             "name": "Отдел систем автоматизации",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "6a8e8553-cb30-11ee-8ac1-001dd8b71c55",
//                             "name": "Отдел календарно-сетевого планирования",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "a0dfcbe2-cb30-11ee-8ac1-001dd8b71c55",
//                             "name": "Отдел документационного и инспекционного контроля",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "b3c7206b-cb30-11ee-8ac1-001dd8b71c55",
//                             "name": "Отдел комплектных установок",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "423a61a7-d7c1-11ee-8ac1-001dd8b71c55",
//                             "name": "Отдел по реализации объектов метрологии",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "9ed3651a-ade6-11ed-89e5-001dd8b71c55",
//                             "name": "Отдел разработки специального программного обеспечения и математического моделирования",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "ae9c87a0-ade6-11ed-89e5-001dd8b71c55",
//                             "name": "Отдел системной интеграции и базового проектирования",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "255f1e65-241e-11ee-8a84-001dd8b71c55",
//                             "name": "Отдел по реализации проектов энергетики",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "bd19ad06-ade6-11ed-89e5-001dd8b71c55",
//                             "name": "Отдел контрольно-измерительных приборов и кабельно-проводниковой продукции",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         }
//                     ]
//                 },
//                 {
//                     "id": "902baa9d-0050-11ee-8a59-001dd8b71c55",
//                     "name": "Специализированное Управление в г. Иннополис",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": [
//                         {
//                             "id": "40d90a11-60f9-11ee-8a87-001dd8b71c55",
//                             "name": "Отдел разработки программных продуктов",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "57cf1baa-60f9-11ee-8a87-001dd8b71c55",
//                             "name": "Отдел внедрения и сопровождения информационных систем",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         }
//                     ]
//                 },
//                 {
//                     "id": "ab81ac25-2d18-11ee-8a84-001dd8b71c55",
//                     "name": "Производственно-административная служба",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": [
//                         {
//                             "id": "be8ec976-2d19-11ee-8a84-001dd8b71c55",
//                             "name": "Группа ООО Фирма \"ГА Инжиниринг\"",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "d32575a8-2d19-11ee-8a84-001dd8b71c55",
//                             "name": "Группа ООО Фирма \"Газприборавтоматика\"",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "52bf5e93-2d19-11ee-8a84-001dd8b71c55",
//                             "name": "Группа ООО \"СовТИГаз\"",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         }
//                     ]
//                 },
//                 {
//                     "id": "3f0e8c3e-f840-11e3-96cc-00155d00e501",
//                     "name": "Управление по работе с предприятиями топливно-энергетического комплекса",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": [
//                         {
//                             "id": "3f0e8c49-f840-11e3-96cc-00155d00e501",
//                             "name": "Отдел маркетинга",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         }
//                     ]
//                 },
//                 {
//                     "id": "296db37d-bf75-11dc-9a9e-0015174673b0",
//                     "name": "Пенсионеры",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": []
//                 },
//                 {
//                     "id": "296db380-bf75-11dc-9a9e-0015174673b0",
//                     "name": "Бухгалтерия",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": [
//                         {
//                             "id": "a0d20a16-2ff9-11e3-967b-001b2184bd0e",
//                             "name": "Отдел учета затрат и внеоборотных активов",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "a0d20a17-2ff9-11e3-967b-001b2184bd0e",
//                             "name": "Отдел учета закупок и поставок",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "539c4c95-8a34-11ec-8870-001dd8b71c55",
//                             "name": "Отдел расчетов с персоналом и контрагентами, регламентированной и налоговой отчетности",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         }
//                     ]
//                 },
//                 {
//                     "id": "ced67cdd-200f-11de-afde-0015174673b1",
//                     "name": "Управление информационно-аналитических систем",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": [
//                         {
//                             "id": "a4124086-7bba-11e0-b5b7-0015174673b1",
//                             "name": "Отдел нормативно-справочной информации",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         }
//                     ]
//                 },
//                 {
//                     "id": "a4124074-7bba-11e0-b5b7-0015174673b1",
//                     "name": "Руководство",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": []
//                 },
//                 {
//                     "id": "a412407a-7bba-11e0-b5b7-0015174673b1",
//                     "name": "Управление систем связи",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": [
//                         {
//                             "id": "2639a58b-2a95-11ed-893d-001dd8b71c55",
//                             "name": "Производственно-конструкторский отдел",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "a412407e-7bba-11e0-b5b7-0015174673b1",
//                             "name": "Производственно-технический отдел",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "a412407b-7bba-11e0-b5b7-0015174673b1",
//                             "name": "Отдел проектирования систем связи",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         }
//                     ]
//                 },
//                 {
//                     "id": "d3a58d48-72f3-11df-b883-0015174673b0",
//                     "name": "Служба корпоративной защиты",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": [
//                         {
//                             "id": "b13fce1e-5ec6-11e6-815f-001dd8b71c55",
//                             "name": "Бюро пропусков",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "590e3080-72f0-11df-b883-0015174673b0",
//                             "name": "Отдел обеспечения защиты имущества",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": [
//                                 {
//                                     "id": "a4124092-7bba-11e0-b5b7-0015174673b1",
//                                     "name": "1 отделение",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "9453c866-5ec6-11e6-815f-001dd8b71c55",
//                                     "name": "2 отделение",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 }
//                             ]
//                         },
//                         {
//                             "id": "590e3082-72f0-11df-b883-0015174673b0",
//                             "name": "Отдел информационной безопасности",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "d3a58d4a-72f3-11df-b883-0015174673b0",
//                             "name": "Отдел экономической безопасности",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "b851be92-a088-11ed-89d4-001dd8b71c55",
//                             "name": "Отдел региональной безопасности",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         }
//                     ]
//                 },
//                 {
//                     "id": "b699f7d4-7729-11e1-b95d-0015174673b1",
//                     "name": "Отдел внутреннего аудита",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": []
//                 },
//                 {
//                     "id": "3d605b0d-7f63-11ec-8862-001dd8b71c55",
//                     "name": "Управление блочно-комплектного технологического оборудования",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": [
//                         {
//                             "id": "227a3fc3-dbc5-11ee-8ac1-001dd8b71c55",
//                             "name": "Проектно-конструкторское бюро",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": [
//                                 {
//                                     "id": "7ea18504-dbc5-11ee-8ac1-001dd8b71c55",
//                                     "name": "Проектно-технический отдел",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "99f6b95f-dbc5-11ee-8ac1-001dd8b71c55",
//                                     "name": "Монтажно-строительный отдел",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": [
//                                         {
//                                             "id": "a7f3c457-dbc5-11ee-8ac1-001dd8b71c55",
//                                             "name": "Группа строительного проектирования",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         },
//                                         {
//                                             "id": "c31fa720-dbc5-11ee-8ac1-001dd8b71c55",
//                                             "name": "Группа монтажного проектирования",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         }
//                                     ]
//                                 },
//                                 {
//                                     "id": "d3eced6b-dbc5-11ee-8ac1-001dd8b71c55",
//                                     "name": "Технологический отдел",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "9a345d14-dbc6-11ee-8ac1-001dd8b71c55",
//                                     "name": "Электромеханический отдел",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": [
//                                         {
//                                             "id": "f4dfc94a-dbc6-11ee-8ac1-001dd8b71c55",
//                                             "name": "Группа электроснабжения",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         },
//                                         {
//                                             "id": "037c0a4f-dbc7-11ee-8ac1-001dd8b71c55",
//                                             "name": "Группа КИПиА",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         },
//                                         {
//                                             "id": "1104cc86-dbc7-11ee-8ac1-001dd8b71c55",
//                                             "name": "Группа слаботочных систем",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         },
//                                         {
//                                             "id": "1c702253-dbc7-11ee-8ac1-001dd8b71c55",
//                                             "name": "Группа отопления, вентиляции и кондиционирования",
//                                             "filial": 0,
//                                             "organizationId": "7704028125",
//                                             "children": []
//                                         }
//                                     ]
//                                 }
//                             ]
//                         },
//                         {
//                             "id": "537aef61-7f69-11ec-8862-001dd8b71c55",
//                             "name": "Отдел организации строительства и комплексного опробования",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "78908bbf-7f6a-11ec-8862-001dd8b71c55",
//                             "name": "Отдел организации производства и кооперации",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "a001b9b5-7f6e-11ec-8862-001dd8b71c55",
//                             "name": "Отдел общесистемных решений",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": [
//                                 {
//                                     "id": "c639bdb3-7f6e-11ec-8862-001dd8b71c55",
//                                     "name": "Группа разработки спецразделов",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 }
//                             ]
//                         }
//                     ]
//                 },
//                 {
//                     "id": "bf7ac4cb-8026-11ec-8863-001dd8b71c55",
//                     "name": "Планово-экономическое управление",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": [
//                         {
//                             "id": "09a2abbb-8027-11ec-8863-001dd8b71c55",
//                             "name": "Планово-экономический отдел",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "21ce2637-8027-11ec-8863-001dd8b71c55",
//                             "name": "Отдел статистики",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         }
//                     ]
//                 },
//                 {
//                     "id": "529d5bd5-8027-11ec-8863-001dd8b71c55",
//                     "name": "Финансовое управление",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": [
//                         {
//                             "id": "af0ece9a-6da7-11ee-8a8d-001dd8b71c55",
//                             "name": "Отдел по обеспечению работы с отдельными банковскими счетами",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "66579741-8027-11ec-8863-001dd8b71c55",
//                             "name": "Финансовый отдел",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "7a039fd0-8027-11ec-8863-001dd8b71c55",
//                             "name": "Отдел учета обязательств",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         }
//                     ]
//                 },
//                 {
//                     "id": "d85818ee-2fd5-11e7-8226-001dd8b71c55",
//                     "name": "Управление реализации ЕРС-проектов",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": [
//                         {
//                             "id": "7b097535-3a29-11e7-8230-001dd8b71c55",
//                             "name": "Отдел подготовки производства",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         }
//                     ]
//                 },
//                 {
//                     "id": "ebf27763-9687-11e9-849f-001dd8b71c55",
//                     "name": "Служба сопровождения реализации БКО",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": []
//                 },
//                 {
//                     "id": "2deeda04-2568-11dd-8542-0015174673b0",
//                     "name": "Управление комплексных проектов",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": [
//                         {
//                             "id": "2ecc6675-ade4-11ed-89e5-001dd8b71c55",
//                             "name": "Отдел перспективных разработок",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "57f1ade8-ade4-11ed-89e5-001dd8b71c55",
//                             "name": "Отдел по созданию систем управления магнитным подвесом",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "7145fa11-794a-11ee-8aa2-001dd8b71c55",
//                             "name": "Отдел административно-производственного обеспечения",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "91a5c3a8-794a-11ee-8aa2-001dd8b71c55",
//                             "name": "Отдел материально-технического обеспечения",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "a68d3847-2637-11dd-9027-0015174673b0",
//                             "name": "Отдел технического обеспечения  и типовых проектных решений",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "a7e71b7a-2d62-11dd-9027-0015174673b0",
//                             "name": "Отдел систем технологической безопасности",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "57afab00-f841-11e3-96cc-00155d00e501",
//                             "name": "Отдел разработки комплексных алгоритмов",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "c3bc23fe-8488-11e2-b4d5-001b2184bd0e",
//                             "name": "Отдел по сопровождению систем",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "1a563acc-5ec6-11e6-815f-001dd8b71c55",
//                             "name": "Отдел АСУ ТП",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "3374bdc2-5ec6-11e6-815f-001dd8b71c55",
//                             "name": "Отдел АСУ энергоснабжения",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "667317f6-5ec6-11e6-815f-001dd8b71c55",
//                             "name": "Отдел опытно-технических работ",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "1960b743-7abc-11ec-885b-001dd8b71c55",
//                             "name": "Отдел конструкторских работ",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "a204a776-7abd-11ec-885b-001dd8b71c55",
//                             "name": "Отдел СЗИ и сетевой инфраструктуры",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "d815a15b-7abd-11ec-885b-001dd8b71c55",
//                             "name": "Отдел внедрения информационно-измерительных систем",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         }
//                     ]
//                 },
//                 {
//                     "id": "32728f64-541b-11ec-882a-001dd8b71c55",
//                     "name": "Управление по работе с персоналом",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": [
//                         {
//                             "id": "2286105e-b450-11ee-8abc-001dd8b71c55",
//                             "name": "Группа по подбору и адаптации персонала",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "3d8d330a-2715-11ef-8ac7-001dd8b71c55",
//                             "name": "Группа по воинскому учету и бронированию граждан, прибывающих в запасе",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "7a20c01c-8f05-11ec-8876-001dd8b71c55",
//                             "name": "Отдел кадрового администрирования и развития персонала",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "94295f22-541d-11ec-882a-001dd8b71c55",
//                             "name": "Отдел организации труда и заработной платы",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         }
//                     ]
//                 },
//                 {
//                     "id": "dc792c07-5c9e-11ec-8835-001dd8b71c55",
//                     "name": "Правовое управление",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": [
//                         {
//                             "id": "fb630810-5ca9-11ec-8835-001dd8b71c55",
//                             "name": "Отдел по работе с имуществом",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "af5703ac-5caa-11ec-8835-001dd8b71c55",
//                             "name": "Отдел корпоративных отношений",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "bdccffee-5cb5-11ec-8835-001dd8b71c55",
//                             "name": "Юридический отдел",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         }
//                     ]
//                 },
//                 {
//                     "id": "726787cd-7789-11ec-8857-001dd8b71c55",
//                     "name": "Инженерный центр разработки встраиваемого программного обеспечения и схемотехники",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": [
//                         {
//                             "id": "2cbb44fe-8fec-11ed-89bf-001dd8b71c55",
//                             "name": "Отдел производства измерительных комплексов",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "dac60d76-8fec-11ed-89bf-001dd8b71c55",
//                             "name": "Экспериментальный цех",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": [
//                                 {
//                                     "id": "f549b140-8fec-11ed-89bf-001dd8b71c55",
//                                     "name": "Участок по сборке и испытаниям газорегулирующего оборудования",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "1ca9da61-8fed-11ed-89bf-001dd8b71c55",
//                                     "name": "Участок станков ЧПУ",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "2ff10800-8fed-11ed-89bf-001dd8b71c55",
//                                     "name": "Слесарный участок",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 }
//                             ]
//                         },
//                         {
//                             "id": "a1558f26-c172-11ec-88b6-001dd8b71c55",
//                             "name": "Отдел механических устройств и систем",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "7806c28d-778a-11ec-8857-001dd8b71c55",
//                             "name": "Отдел схемотехники",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": [
//                                 {
//                                     "id": "8b263b2d-c170-11ec-88b6-001dd8b71c55",
//                                     "name": "Участок производства электронных изделий",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 }
//                             ]
//                         }
//                     ]
//                 },
//                 {
//                     "id": "6839c6ab-785a-11ec-8858-001dd8b71c55",
//                     "name": "Управление автоматизации производственно-технологических процессов",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": [
//                         {
//                             "id": "6756bd4a-785b-11ec-8858-001dd8b71c55",
//                             "name": "Отдел проектирования производственных систем",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": [
//                                 {
//                                     "id": "66c012f3-b150-11ee-8abc-001dd8b71c55",
//                                     "name": "Группа СОДУ",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "78ae7bc5-b150-11ee-8abc-001dd8b71c55",
//                                     "name": "Группа телемеханики",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "890d1144-b150-11ee-8abc-001dd8b71c55",
//                                     "name": "Группа нормоконтроля и сертификации",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 }
//                             ]
//                         },
//                         {
//                             "id": "4267d352-785e-11ec-8858-001dd8b71c55",
//                             "name": "Отдел разработки и внедрения производственных систем",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": [
//                                 {
//                                     "id": "5b505bd7-61c3-11ee-8a87-001dd8b71c55",
//                                     "name": "Группа телемеханики \"Москва\"",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "6b90b215-61c3-11ee-8a87-001dd8b71c55",
//                                     "name": "Группа телемеханики \"Уфа\"",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "8e2438eb-61c3-11ee-8a87-001dd8b71c55",
//                                     "name": "Группа СОДУ \"Москва\"",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "9ca4198b-61c3-11ee-8a87-001dd8b71c55",
//                                     "name": "Группа СОДУ \"Нижний Новгород\"",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 }
//                             ]
//                         },
//                         {
//                             "id": "dacd5b5e-785e-11ec-8858-001dd8b71c55",
//                             "name": "Отдел перспективного развития производственных систем",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": [
//                                 {
//                                     "id": "b75de0b5-61c3-11ee-8a87-001dd8b71c55",
//                                     "name": "Группа разработки специальных приложений",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 }
//                             ]
//                         },
//                         {
//                             "id": "22d67185-785f-11ec-8858-001dd8b71c55",
//                             "name": "Отдел по сопровождению производственных систем",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": [
//                                 {
//                                     "id": "036a3b32-61c3-11ee-8a87-001dd8b71c55",
//                                     "name": "Группа внедрения и технического обслуживания",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "242b99b5-61c3-11ee-8a87-001dd8b71c55",
//                                     "name": "Группа разработки и тестирования",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "377c16ee-61c3-11ee-8a87-001dd8b71c55",
//                                     "name": "Группа МТО",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "4619b878-61c3-11ee-8a87-001dd8b71c55",
//                                     "name": "Группа административного сопровождения",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 }
//                             ]
//                         },
//                         {
//                             "id": "507bd4e8-785f-11ec-8858-001dd8b71c55",
//                             "name": "Отдел системно-технической инфраструктуры",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         }
//                     ]
//                 },
//                 {
//                     "id": "66bc9e7b-7ce0-11ec-885e-001dd8b71c55",
//                     "name": "Отдел охраны труда, промышленной безопасности и экологии",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": []
//                 },
//                 {
//                     "id": "708a0828-7cec-11ec-885e-001dd8b71c55",
//                     "name": "Сметно-договорное управление",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": [
//                         {
//                             "id": "47ad86fe-7cf1-11ec-885e-001dd8b71c55",
//                             "name": "Отдел договорной работы",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "bb77d2ff-7cf1-11ec-885e-001dd8b71c55",
//                             "name": "Отдел учета выполненных работ",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "d0583fd2-7cf1-11ec-885e-001dd8b71c55",
//                             "name": "Сметный отдел",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         }
//                     ]
//                 },
//                 {
//                     "id": "2186539a-7dc0-11ec-8860-001dd8b71c55",
//                     "name": "Специализированное Управление в г. Саров",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": [
//                         {
//                             "id": "d5a86b50-7dc6-11ec-8860-001dd8b71c55",
//                             "name": "Группа сопровождения производства работ",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "7c729fce-7dc9-11ec-8860-001dd8b71c55",
//                             "name": "Отдел разработки",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": [
//                                 {
//                                     "id": "248c8361-9002-11ed-89bf-001dd8b71c55",
//                                     "name": "Группа конструкторских работ",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "9cc236c1-7dc9-11ec-8860-001dd8b71c55",
//                                     "name": "Группа разработки программного обеспечения",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 },
//                                 {
//                                     "id": "20bc7f5a-7dca-11ec-8860-001dd8b71c55",
//                                     "name": "Группа внедрения и технической поддержки",
//                                     "filial": 0,
//                                     "organizationId": "7704028125",
//                                     "children": []
//                                 }
//                             ]
//                         }
//                     ]
//                 },
//                 {
//                     "id": "5c07ac8c-7e77-11ec-8861-001dd8b71c55",
//                     "name": "Управление по техническому контролю, сертификации и функционированию интегрированной системы качества",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": [
//                         {
//                             "id": "0903bd46-7f7d-11ed-89a9-001dd8b71c55",
//                             "name": "Служба качества в г. Калининград",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "35897915-7f7d-11ed-89a9-001dd8b71c55",
//                             "name": "Служба качества в г. Саратов",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "3084dbe4-805c-11ed-89aa-001dd8b71c55",
//                             "name": "Служба качества в пгт. Афипский",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "96bff0e2-5146-11ee-8a85-001dd8b71c55",
//                             "name": "Отдел по предквалификации",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "70df3fa7-7e77-11ec-8861-001dd8b71c55",
//                             "name": "Отдел по управлению интегрированной системой качества",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "7d0665a2-7e77-11ec-8861-001dd8b71c55",
//                             "name": "Отдел по сертификации продукции и услуг",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "8ab56592-7e77-11ec-8861-001dd8b71c55",
//                             "name": "Отдел нормоконтроля и экспертизы",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         },
//                         {
//                             "id": "99360966-7e77-11ec-8861-001dd8b71c55",
//                             "name": "Отдел технического контроля",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         }
//                     ]
//                 },
//                 {
//                     "id": "0af600b2-7ea7-11ec-8861-001dd8b71c55",
//                     "name": "Отдел по корпоративным коммуникациям",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": []
//                 },
//                 {
//                     "id": "c5ad6707-7ea7-11ec-8861-001dd8b71c55",
//                     "name": "Служба главного энергетика",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": []
//                 },
//                 {
//                     "id": "b41e4400-df4e-11e4-8198-00155d92030a",
//                     "name": "Административно-хозяйственное управление",
//                     "filial": 0,
//                     "organizationId": "7704028125",
//                     "children": [
//                         {
//                             "id": "8a95f29f-c376-11e6-81c1-001dd8b71c55",
//                             "name": "Отдел по организации ремонта и обслуживания объектов Общества",
//                             "filial": 0,
//                             "organizationId": "7704028125",
//                             "children": []
//                         }
//                     ]
//                 }
//             ]
//         },
//     ]
// }
