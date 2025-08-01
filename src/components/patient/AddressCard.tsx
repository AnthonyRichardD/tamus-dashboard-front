// components/patient/AddressCard.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LuMapPin } from 'react-icons/lu';
import { PatientAddress } from '@/types/patient.types';

interface AddressCardProps {
    data: PatientAddress;
}

export const AddressCard: React.FC<AddressCardProps> = ({ data }) => {
    return (
        <Card className="flex-1 shadow-sm border-gray-200 rounded-lg gap-0 col-span-2 min-[926px]:col-span-1">
            <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold flex items-center text-gray-700">
                    <LuMapPin className="mr-2 h-5 w-5 text-gray-500" />
                    Endereço
                </CardTitle>
            </CardHeader>
            {
                data ?
                    <CardContent className="text-sm">
                        <p className="mb-2"><span className="text-gray-500">CEP:</span> <span className="font-medium text-gray-800">{data.zip_code}</span></p>
                        <p className="mb-2"><span className="text-gray-500">Rua:</span> <span className="font-medium text-gray-800">{data.street}</span></p>
                        <p className="mb-2"><span className="text-gray-500">Bairro:</span> <span className="font-medium text-gray-800">{data.neighborhood}</span></p>
                        <p><span className="text-gray-500">Cidade:</span> <span className="font-medium text-gray-800">{data.city} - {data.state}</span></p>
                    </CardContent>
                    :
                    <CardContent className="text-sm">
                        <p className="text-gray-500">Nenhum endereço cadastrado</p>
                    </CardContent>
            }
        </Card>
    );
};