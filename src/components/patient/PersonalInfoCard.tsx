import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { PersonalInfo, HealthCondition } from '../../types/patient';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { FiUser, FiMail, FiPhone, FiHeart, FiAlertCircle } from 'react-icons/fi';

interface PersonalInfoCardProps {
    data: PersonalInfo;
    healthConditions: HealthCondition[];
}

const calculateAge = (birthDate: string): number => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
};

export const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({ data, healthConditions }) => {
    const age = calculateAge(data.birthDate);

    return (
        <Card className="flex-1 col-span-2 bg-white border border-gray-200 shadow-sm rounded-xl">
            <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold flex items-center text-gray-800">
                    <FiUser className="mr-2 h-5 w-5 text-black" />
                    Informações Pessoais
                </CardTitle>
            </CardHeader>

            <CardContent className="pt-0 text-sm text-gray-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                        <p className="text-gray-500 mb-1">Nome Completo</p>
                        <p className="font-medium">{data.fullName}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 mb-1">CPF</p>
                        <p className="font-medium">{data.cpf}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 mb-1">Email</p>
                        <p className="font-medium flex items-center">
                            <FiMail className="mr-1 text-gray-600" />
                            {data.email}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-500 mb-1">Telefone</p>
                        <p className="font-medium flex items-center">
                            <FiPhone className="mr-1 text-gray-600" />
                            {data.phone}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-500 mb-1">Data de Nascimento</p>
                        <p className="font-medium">
                            {new Date(data.birthDate).toLocaleDateString('pt-BR')} ({age} anos)
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-500 mb-1">Status</p>
                        <Badge className={`text-xs font-medium px-2 py-0.5 rounded-md ${data.status === 'Ativo' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                            {data.status}
                        </Badge>
                    </div>
                </div>

                <Separator className="my-6" />

                <div>
                    <p className="flex items-center text-gray-700 font-medium mb-2">
                        <FiHeart className="mr-2 text-gray-500" />
                        Condições de Saúde
                    </p>

                    {healthConditions.length > 0 ? (
                        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-md p-3 flex items-start">
                            <FiAlertCircle className="mr-2 mt-0.5 text-yellow-500" />
                            <span>
                                {healthConditions.map((condition) => condition.description).join(', ')}
                            </span>
                        </div>
                    ) : (
                        <div className="bg-gray-50 border border-gray-200 text-gray-600 text-sm rounded-md p-3">
                            Nenhuma condição registrada.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
