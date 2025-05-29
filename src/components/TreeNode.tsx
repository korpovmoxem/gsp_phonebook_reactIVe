import { useState } from 'react';
import { Organization } from '../types';
import styled from 'styled-components';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface Props {
  node: Organization;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const ChevronDownButton = styled(ChevronDown)`
    cursor: pointer;
    &:hover {
        color: #00000070;
    }
`

const ChevronRightButton = styled(ChevronRight)`
    cursor: pointer;
    &:hover {
        color: #00000070;
    }
`

const ItemText = styled.span`
    &:hover {
        color: #00000070;
    }
`

export const TreeNode: React.FC<Props> = ({ node, selectedId, onSelect }) => {
  const [expanded, setExpanded] = useState(false);

  const hasChildren = node.Children && node.Children.length > 0;
  const isSelected = selectedId === node.ID;

  return (
    <div style={{ paddingLeft: 20 }}>
      <div
        style={{ cursor: 'pointer', fontWeight: isSelected ? 'bold' : 'normal', display: 'flex' }}
        onClick={() => onSelect(String(node.ID))}
      >
        {hasChildren && (
          <span onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}>
            {expanded ? <ChevronDownButton /> : <ChevronRightButton />}&nbsp;
          </span>
        )}
        <ItemText>{node.Name}</ItemText>
      </div>
      {expanded && hasChildren && node.Children.map((child) => (
        <TreeNode key={child.ID} node={child} selectedId={selectedId} onSelect={onSelect} />
      ))}
    </div>
  );
};