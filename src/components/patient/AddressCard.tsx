// components/patient/AddressCard.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Address } from '../../types/patient';
import { LuMapPin } from 'react-icons/lu';

interface AddressCardProps {
    data: Address;
}

export const AddressCard: React.FC<AddressCardProps> = ({ data }) => {
    return (
        <Card className="flex-1 shadow-sm border-gray-200">
            <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold flex items-center text-gray-700">
                    <LuMapPin className="mr-2 h-5 w-5 text-gray-500" />
                    Endereço
                </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
                <p className="mb-2"><span className="text-gray-500">CEP:</span> <span className="font-medium text-gray-800">{data.zipCode}</span></p>
                <p className="mb-2"><span className="text-gray-500">Rua:</span> <span className="font-medium text-gray-800">{data.street}</span></p>
                <p className="mb-2"><span className="text-gray-500">Bairro:</span> <span className="font-medium text-gray-800">{data.neighborhood}</span></p>
                <p><span className="text-gray-500">Cidade:</span> <span className="font-medium text-gray-800">{data.city}</span></p>
            </CardContent>
        </Card>
    );
};