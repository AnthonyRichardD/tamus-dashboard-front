// components/patient/HealthConditionsCard.tsx
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { HealthCondition } from '../../types/patient';
import { MdOutlineWarningAmber } from 'react-icons/md'; // Exemplo de ícone, instale react-icons

interface HealthConditionsCardProps {
    data: HealthCondition[];
}

export const HealthConditionsCard: React.FC<HealthConditionsCardProps> = ({ data }) => {
    if (!data || data.length === 0) return null;

    return (
        <Card className="border-l-4 border-yellow-500 bg-yellow-50 shadow-sm border-gray-200">
            <CardContent className="flex items-center p-3"> {/* Ajuste de padding */}
                <MdOutlineWarningAmber className="text-yellow-600 text-2xl mr-3 flex-shrink-0" /> {/* Cor mais amarela */}
                <div className="flex flex-col">
                    <p className="text-sm text-gray-500">Condições de Saúde</p>
                    {data.map(condition => (
                        <p key={condition.id} className="text-yellow-800 font-medium leading-snug text-sm"> {/* Cor e tamanho da fonte */}
                            {condition.description}
                        </p>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};